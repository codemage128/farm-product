import Stripe from "stripe";
import jwt from "jsonwebtoken";
import Cart from "../../models/Cart";
import User from "../../models/User";
import connectDb from "../../utils/connectDb";
import Product from "../../models/Product";
import Order from "../../models/Order";
import FarmOrder from "../../models/FarmOrder";
import baseUrl from "../../utils/baseUrl"
import ActivityFeed from "../../models/ActivityFeed";
import calculateCartTotal from "../../utils/calculateCartTotal";
import calculateDistance from "../../utils/calculateDistance"
import objectId from "../../utils/generateObject";
import _ from "underscore";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const fee = 5;
const nodemailer = require('nodemailer');

function calculateDistanceOnProducts(cartProducts, location) {
  let products = [];

  for (let i in cartProducts) {
    let {_id, quantity, deliveryPrice, price, deliveryType, deliveryUnit, product} = cartProducts[i];

    const p_location = product.location;
    const distance = calculateDistance(location.lat, location.lng, p_location.lat, p_location.lng, "M");
    products.push({_id, quantity, deliveryPrice, price, deliveryType, deliveryUnit, product, distance});
  }

  const { cartTotal } = calculateCartTotal(products);
  return { cartTotal, products };
};

export default async (req, res) => {
  if (!("authorization" in req.headers)) {
    return res.status(401).send("No authorization token");
  }
  try {
    const orderUserInfo = req.body.order;
    let newOrderId;
    connectDb();

    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );

    const cart = await Cart.findOne({ user: userId }).populate({
      path: "products.product",
      model: "Product",
    });

    const consumer = await User.findById(userId)
    const { cartTotal, products } = calculateDistanceOnProducts(cart.products, orderUserInfo.order.location);
    
    await new Order({
      _id: objectId(),
      user: userId,
      email: orderUserInfo.order.email,
      total: cartTotal,
      products: products,
    }).save((err, newOrder) => {
      newOrderId = newOrder._id;
    });

    var farmerOrderGroups = _.groupBy(products, function (
      farmOrderProduct
    ) {
      return farmOrderProduct.product.owner;
    });

    for (let i in farmerOrderGroups) {
      let farmOrderGroup = farmerOrderGroups[i];

      var compiledProducts = [];
      var farmOrderQty = 0;
      var farmOrderTotal = 0;

      for (var x = 0; x < farmOrderGroup.length; x++) {
        farmOrderQty += farmOrderGroup[x].quantity;
        farmOrderTotal +=
          farmOrderGroup[x].quantity * farmOrderGroup[x].price +
          farmOrderGroup[x].deliveryPrice * farmOrderGroup[x].distance;

        compiledProducts[x] = {
          _id: objectId(),
          product: farmOrderGroup[x].product._id,
          quantity: farmOrderGroup[x].quantity,
          deliveryPrice: farmOrderGroup[x].deliveryPrice,
          distance: farmOrderGroup[x].distance,
          deliveryType: farmOrderGroup[x].deliveryType,
          deliveryUnit: farmOrderGroup[x].deliveryUnit,
          price: farmOrderGroup[x].price,
        };

        await Product.findOneAndUpdate(
          { _id: farmOrderGroup[x].product._id },
          { $inc: { inventoryQuantity: -farmOrderGroup[x].quantity } }
        );
      }

      const farmer = await User.findById(farmOrderGroup[0].product.owner);

      const transfer = await stripe.transfers.create({
        amount: Math.floor((farmOrderTotal * (100 - fee)).toFixed(2)),
        currency: "usd",
        destination: farmer.stripeId,
        transfer_group: orderUserInfo.order.groupID,
      });

      let farmOrderInfo = await new FarmOrder({
        _id: objectId(),
        count: farmOrderQty,
        total: farmOrderTotal.toFixed(2),
        status: "notdelivered",
        farmer: farmer._id,
        consumerID: userId,
        consumer:
          orderUserInfo.order.firstName + " " + orderUserInfo.order.lastName,
        email: orderUserInfo.order.email,
        location:
          orderUserInfo.order.address1 +
          " " +
          orderUserInfo.order.address2 +
          ", " +
          orderUserInfo.order.city +
          ", " +
          orderUserInfo.order.state +
          " " +
          orderUserInfo.order.zip,
        products: compiledProducts,
      }).save();

      await new ActivityFeed({
        _id: objectId(),
        user: farmer._id,
        message:
          orderUserInfo.order.firstName +
          " " +
          orderUserInfo.order.lastName +
          " has placed an order for $" +
          farmOrderTotal.toFixed(2) +
          " containing " + farmOrderQty + " products.",
        mediaUrl: null,
        userUrl: consumer.mediaUrl
      }).save();

      await new ActivityFeed({
        _id: objectId(),
        user: userId,
        message:
          "You have placed an order for $" +
          farmOrderTotal.toFixed(2) +
          " containing " + farmOrderQty + " products from " +
          farmer.name + ".",
        mediaUrl: null,
        userUrl: farmer.mediaUrl
      }).save();

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: `${process.env.EMAIL_ADDRESS}`,
          pass: `${process.env.EMAIL_PASSWORD}`,
        },
      })

      const mailOptions = {
        from: 'support@localdrop.org',
        to: `${farmer.username}`,
        subject: 'LocalDrop.org - New Order!',
        text:
          'A new order was placed on LocalDrop.org for you to deliver.\n\n'
          + `${baseUrl}/orderDetail?_id=${farmOrderInfo._id}\n\n`
          + 'Thanks for being part of the LocalDrop.org marketplace!\n',
      }

      transporter.sendMail(mailOptions, (err, response) => {
        if (err) {
          console.error('Error: ', err);
        } else {
          res.status(200).json('Farmer Email Sent');
        }
      })

      const mailOptions2 = {
        from: 'support@localdrop.org',
        to: `${orderUserInfo.order.email}`,
        subject: 'LocalDrop.org - Order Complete!',
        text:
          'Thank you for your order! It has been sent to the farm and will arrive in less than a week.\n\n'
          + `${baseUrl}/account\n\n`
          + 'Thanks for being part of the LocalDrop.org marketplace!\n',
      }

      transporter.sendMail(mailOptions2, (err, response) => {
        if (err) {
          console.error('Error: ', err);
        } else {
          res.status(200).json('Customer email sent.');
        }
      })
    }

    res.status(200).json({ message: "Chekout Successful", newOrderId });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing charge");
  } finally {
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    const cartClear = await Cart.findOne({ user: userId })
    await Cart.findOneAndUpdate({ _id: cartClear._id }, { $set: { products: [] } });
  }
};

import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Cart from "../../models/Cart";
import Product from "../../models/Product";
import connectDb from "../../utils/connectDb";
import objectId from "../../utils/generateObject"

connectDb();

const { ObjectId } = mongoose.Types;

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await handleGetRequest(req, res);
      break;
    case "PUT":
      await handlePutRequest(req, res);
      break;
    case "DELETE":
      await handleDeleteRequest(req, res);
      break;
    default:
      res.status(405).send(`Method ${req.method} not allowed`);
      break;
  }
};

async function handleGetRequest(req, res) {
  if (!("authorization" in req.headers)) {
    return res.status(401).send("No authorization token");
  }
  try {
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    var cart = await Cart.findOne({ user: userId });

    if (!cart) {
      var cart = await new Cart({ _id: objectId(), user: userId }).save()
    }

    const getCart = await Cart.findOne({ user: userId }).populate({
      path: "products.product",
      model: "Product"
    });
    res.status(200).json(getCart.products);
  } catch (error) {
    console.error(error);
    res.status(403).send("Please login again");
  }
}

async function handlePutRequest(req, res) {
  const { quantity, price, productId, deliveryMethod } = req.body;
  if (!("authorization" in req.headers)) {
    return res.status(401).send("No authorization token");
  }
  try {
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    
    // Get user cart based on userId
    var cart = await Cart.findOne({ user: userId });
    // Get product based on productId
    var product = await Product.findOne({ _id: productId });
    // Get Delivery Price / Mile base on deliveryMethod
    var delivery = product.deliveryMethods.find(d => d.type === deliveryMethod);

    if (!cart) {
      var cart = await new Cart({ _id: objectId(), user: userId }).save()
    }
    // Check if product already exists in cart
    const productExists = cart.products.some(doc =>
      ObjectId(productId).equals(doc.product)
    );
    // If so, increment quantity (by number provided to request)
    if (productExists) {
      await Cart.findOneAndUpdate(
        { _id: cart._id, "products.product": productId },
        {
          $set: {
            "products.$.deliveryPrice": delivery.price,
            "products.$.deliveryType": delivery.type,
            "products.$.deliveryUnit": delivery.unit,
            "products.$.price": price
          },
          $inc: {
            "products.$.quantity": quantity,
          }
        }
      );
    } else {
      // If not, add new product with given quantity
      const newProduct = { 
        product: productId, 
        quantity, 
        price,
        deliveryPrice: delivery.price,
        deliveryType: delivery.type,
        deliveryUnit: delivery.unit
      };
      await Cart.findOneAndUpdate(
        { _id: cart._id },
        {
          $addToSet: { products: newProduct }
        }
      );
    }
    res.status(200).send("Cart updated");
  } catch (error) {
    console.error(error);
    res.status(403).send("Please login again");
  }
}

async function handleDeleteRequest(req, res) {
  const { productId } = req.query;
  if (!("authorization" in req.headers)) {
    return res.status(401).send("No authorization token");
  }
  try {
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { $pull: { products: { product: productId } } },
      { new: true }
    ).populate({
      path: "products.product",
      model: "Product"
    });
    res.status(200).json(cart.products);
  } catch (error) {
    console.error(error);
    res.status(403).send("Please login again");
  }
}

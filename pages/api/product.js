import Product from "../../models/Product";
import ActivityFeed from "../../models/ActivityFeed";
import FarmProduct from "../../models/FarmProduct";
import Cart from "../../models/Cart";
import User from "../../models/User";
import connectDb from "../../utils/connectDb";
import objectId from "../../utils/generateObject";
import shortid from "shortid";
import jwt from "jsonwebtoken";
import { Feed } from "semantic-ui-react";

connectDb();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await handleGetRequest(req, res);
      break;
    case "POST":
      await handlePostRequest(req, res);
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
  const { _id, type } = req.query;

  let product = await Product.findOne({ _id });
  let farmProduct = [];

  for (let i in product.includedProducts) {
    let p = product.includedProducts[i];

    let data = await FarmProduct.findOne({ _id: p._id });

    farmProduct.push({ _id: data._id, name: data.name, quantity: p.quantity });
  }

  if (!("authorization" in req.headers)) {
    return res.status(200).json({ product, farmProduct });
  } else {
    try {
      const { userId } = jwt.verify(
        req.headers.authorization,
        process.env.JWT_SECRET
      );

      var farmProducts = await (
        await FarmProduct.find({ ownerId: userId })
      ).reverse();

      res.status(200).json({ product, farmProduct, farmProducts });
    } catch (error) {
      console.error(error);
      res.status(403).send("Please login again");
    }
  }
}

async function handlePostRequest(req, res) {
  const {
    name,
    farmer,
    price,
    description,
    includedProducts,
    deliveryMethods,
    location,
    deliveryArea,
    inventoryQuantity,
    mediaUrl,
    owner,
  } = req.body;

  try {
    if (
      !name ||
      !price ||
      !description ||
      !mediaUrl ||
      !includedProducts ||
      !location ||
      !deliveryArea ||
      !inventoryQuantity ||
      !deliveryMethods
    ) {
      return res.status(422).send("Product missing one or more fields");
    }
    const farmer = await User.findOne({ _id: owner, roles: ["farmerApproved"] });
    if (farmer) {
      let includedProductsList = includedProducts.map((item) => {
        return {
          _id: item._id,
          quantity: item.quantity,
          unit: item.unit,
        };
      });

      let deliveryMethodsList = deliveryMethods.map((item) => {
        return {
          type: item.type,
          price: item.price,
          unit: item.unit
        };
      });

      const product = await new Product({
        _id: objectId(),
        name,
        price,
        description,
        mediaUrl,
        includedProducts: includedProductsList,
        deliveryMethods: deliveryMethodsList,
        location,
        deliveryArea,
        inventoryQuantity,
        active: true,
        owner: owner,
        sku: shortid.generate(),
        farmer: farmer.name,
      }).save();

      await new ActivityFeed({
        _id: objectId(),
        user: owner,
        message: "You have created product named " + name + " .",
        mediaUrl: mediaUrl,
        userUrl: farmer.mediaUrl,
      }).save();
      res.status(201).json(product);
    } else {
      res.status(201).json("no");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error in creating product");
  }
}

async function handlePutRequest(req, res) {
  const {
    _id,
    name,
    farmer,
    price,
    description,
    includedProducts,
    location,
    deliveryArea,
    inventoryQuantity,
    deliveryMethods,
    mediaUrl,
    owner,
  } = req.body;

  try {
    if (
      !name ||
      !price ||
      !description ||
      !includedProducts ||
      !location ||
      !deliveryArea ||
      !inventoryQuantity ||
      !deliveryMethods
    ) {
      return res.status(422).send("Product missing one or more fields");
    }

    let includedProductsList = includedProducts.map((item) => {
      return {
        _id: item._id,
        quantity: item.quantity,
        unit: item.unit
      };
    });

    let deliveryMethodsList = deliveryMethods.map((item) => {
      return {
        type: item.type,
        price: item.price,
        unit: item.unit
      };
    });

    let product = await Product.findOne({ _id });
    if (mediaUrl && mediaUrl != product.mediaUrl) product.mediaUrl = mediaUrl;
    if (name != product.name) product.name = name;
    if (price != product.price) product.price = price;
    if (description != product.description) product.description = description;
    if (location != product.location) product.location = location;
    if (deliveryArea != product.deliveryArea)
      product.deliveryArea = deliveryArea;
    if (inventoryQuantity != product.inventoryQuantity)
      product.inventoryQuantity = inventoryQuantity;
    if (owner != product.owner) product.owner = owner;
    if (farmer != product.farmer) product.farmer = farmer;
    if (includedProductsList != product.includedProducts)
      product.includedProducts = includedProductsList;
      if (deliveryMethodsList != product.deliveryMethods)
      product.deliveryMethods = deliveryMethodsList;

    try {
      await product.save();
    } catch (error) {
      console.log(error);
    }
    res.status(200).json("Product updated.");
  } catch (error) {
    console.error(error);
    res.status(403).send("Please login again");
  }
}

// async function handleDeleteRequest(req, res) {
//   const { _id, userId } = req.query;
//   try {
//     // 1) Delete product by id
//     await Product.findOneAndDelete({ _id, owner: userId });
//     // 2) Remove product from all carts, referenced as 'product'
//     await Cart.updateMany(
//       { "products.product": _id },
//       { $pull: { products: { product: _id } } }
//     );
//     res.status(204).json({});
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error deleting product");
//   }
// }

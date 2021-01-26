import FarmProduct from "../../models/FarmProduct";
import ActivityFeed from "../../models/ActivityFeed";
import User from "../../models/User";
import connectDb from "../../utils/connectDb";
import objectId from "../../utils/generateObject";
import jwt from "jsonwebtoken";

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

async function handlePutRequest(req, res) {
  const { _id, ownerId } = req.body;
  try {
    let duplicate = await FarmProduct.findOne({ ownerId, name });
    if (duplicate && duplicate._id != _id) {
      res.status(403).send("Duplicate product already exists.");
      return false;
    } else {
      await FarmProduct.findOneAndUpdate({ _id }, { name });
    }
    res.status(200).json("Product updated.");
  } catch (error) {
    console.error(error);
    res.status(403).send("Please login again");
  }
}

async function handleGetRequest(req, res) {
  const { _id } = req.query;
  if (!("authorization" in req.headers)) {
    return res.status(401).send("No authorization token - GET");
  }
  try {
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    const farmProduct = await FarmProduct.findOne({ _id, ownerId: userId });
    res.status(200).json(farmProduct);
  } catch (error) {
    console.error(error);
    res.status(403).send("Please login again");
  }
}

async function handlePostRequest(req, res) {
  const { name, owner, ownerId, unit } = req.body;
  const farmer = await User.findById(ownerId);
  try {
    let duplicate = await FarmProduct.findOne({ ownerId, name });
    if (!duplicate) {
      const farmProduct = await new FarmProduct({
        _id: objectId(),
        name,
        unit,
        ownerId,
        owner,
      }).save();

      await new ActivityFeed({
        _id: objectId(),
        user: ownerId,
        message: "You have created farm product named " + name + ".",
        mediaUrl: null,
        userUrl: farmer.mediaUrl,
      }).save();

      res.status(201).json(farmProduct);
    } else {
      res.status(403).send("Duplicate product already exists.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error in creating product");
  }
}

async function handleDeleteRequest(req, res) {
  const { _id, userId } = req.query;
  try {
    await FarmProduct.findOneAndDelete({ _id, ownerId: userId });
    res.status(204).json({});
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting product");
  }
}

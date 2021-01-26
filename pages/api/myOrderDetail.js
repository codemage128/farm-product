import Order from "../../models/Order";
import Product from "../../models/Product";
import jwt from "jsonwebtoken";
import connectDb from "../../utils/connectDb";

connectDb();

export default async (req, res) => {
  try {
    const { _id } = req.query;

    const order = await Order.findOne({ _id: _id})
      .sort({ createdAt: "desc" })
      .populate({
        path: "products.product",
        model: Product
      });
    res.status(200).json({ order });
  } catch (error) {
    console.error(error);
    res.status(403).send("Please login again");
  }
};

import Customer from "../../models/Customer";
import Product from "../../models/Product";
import jwt from "jsonwebtoken";
import connectDb from "../../utils/connectDb";

connectDb();

export default async (req, res) => {
  try {
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    const customer = await Customer.find({ userId: userId })

    res.status(200).json({ customer });
  } catch (error) {
    console.error(error);
    res.status(403).send("Please login again");
  }
};

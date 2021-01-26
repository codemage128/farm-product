import jwt from "jsonwebtoken";
import Product from "../../models/Product";
import connectDb from "../../utils/connectDb";

connectDb();

export default async (req, res) => {
    try {
      const { userId } = jwt.verify(
        req.headers.authorization,
        process.env.JWT_SECRET
      );
  
      const productSales = await Product.find({ owner: userId })
        .sort({ createdAt: "desc" })
      res.status(200).json({ productSales });
    } catch (error) {
      console.error(error);
      res.status(403).send("Please login again");
    }
  };

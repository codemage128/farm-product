import jwt from "jsonwebtoken";
import connectDb from "../../utils/connectDb";
import FarmOrder from "../../models/FarmOrder";

connectDb();

export default async (req, res) => {
  try {
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );

    console.log("foo")
    const farmOrders = await FarmOrder.find({ farmer: userId })
      .sort({ createdAt: "desc" })
    res.status(200).json({ farmOrders });
  } catch (error) {
    console.error(error);
    res.status(403).send("Please login again");
  }
};

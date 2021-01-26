import jwt from "jsonwebtoken";
import connectDb from "../../utils/connectDb";
import Product from "../../models/Product";
import FarmOrder from "../../models/FarmOrder";
import FarmProduct from "../../models/FarmProduct";

connectDb();

export default async (req, res) => {
  try {
    const { _id } = req.query;
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );

    const orderDetails = await FarmOrder.findOne({
      $and: [{ farmer: userId }, { _id: _id }],
    })
      .populate({
        path: "products.product",
        model: "Product",
      })
      .sort({
        createdAt: "desc",
      });

    for (let p of orderDetails.products) {
      for (let product of p.product.includedProducts) {
        let farmProduct = await FarmProduct.findOne({ _id: product._id });
        product["farmProduct"] = farmProduct;
      }
    }

    res.status(200).json({ orderDetails });
  } catch (error) {
    console.error(error);
    res.status(403).send("Please login again");
  }
};

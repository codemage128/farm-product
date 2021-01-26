import mongoose from "mongoose";
import Product from "./Product"
import objectId from "../utils/generateObject";
const { ObjectId, Number } = mongoose.Schema.Types;

const CartSchema = new mongoose.Schema({
  _id : {
    type: String,
  },
  user: {
    type: String,
  },
  products: [
    {
      quantity: {
        type: Number,
        default: 1
      },
      product: {
        type: String,
        required: true
      },
      price: {
        type: Number,
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      deliveryType: {
        type: String,
        required: true
      },
      deliveryUnit: {
        type: String,
        required: true
      }
    }
  ]
});

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);

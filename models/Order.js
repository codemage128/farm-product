import mongoose from "mongoose";
import objectId from "../utils/generateObject";

const { ObjectId, Number } = mongoose.Schema.Types;

const OrderSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
    },
    user: {
      type: String,
    },
    products: [
      {
        _id: {
          type: String
        },
        quantity: {
          type: Number,
          default: 1
        },
        product: {
          type: String,
        },
        price: {
          type: Number,
        },
        deliveryPrice: {
          type: Number,
        },
        deliveryType: {
          type: String,
        },
        deliveryUnit: {
          type: String,
          required: true
        },
        distance: {
          type: Number,
        }
      }
    ],
    email: {
      type: String,
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// prettier-ignore
export default mongoose.models.Order || mongoose.model("Order", OrderSchema);

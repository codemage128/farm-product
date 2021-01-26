import mongoose from "mongoose";
import objectId from "../utils/generateObject";

const { ObjectId, Number } = mongoose.Schema.Types;

const FarmOrderSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
    },
    count: {
      type: Number,
      default: 1,
    },
    total: {
      type: Number,
    },
    status: {
      type: String,
      required: true,
    },
    farmer: {
      type: String,
      required: true,
    },
    consumerID: {
      type: String,
      required: true,
    },
    consumer: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
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
  },
  {
    timestamps: true,
  }
);

// prettier-ignore
export default mongoose.models.FarmOrder || mongoose.model("FarmOrder", FarmOrderSchema);

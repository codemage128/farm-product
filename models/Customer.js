import mongoose from "mongoose";
import objectId from "../utils/generateObject";

const { ObjectId, Number, String } = mongoose.Schema.Types;

const CustomerSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: objectId()
    },
    userId: {
      type: String,
    },
    customerId: {
      type: String,
      required: false
    },
    'card.brand': {
      type: String,
      required: false
    },
    'card.last4': {
      type: String,
      required: false
    },
    'subscription.id': {
      type: String,
      required: false
    },
    'subscription.status': {
      type: String,
      enum: ['active', 'cancelling', 'canceled', 'none', 'trialing'],
      required: false
    },
    'subscription.plan': {
      type: String,
      required: false
    },
    'subscription.current_period_end': {
      type: Number,
      required: false
    }
  }, {collection: "Customers"});

// prettier-ignore
export default mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);

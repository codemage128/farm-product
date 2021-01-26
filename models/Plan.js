import mongoose from "mongoose";
import objectId from "../utils/generateObject";

const { String, Number, ObjectId } = mongoose.Schema.Types;

const PlanSchema = new mongoose.Schema({
    _id: {type: String,},
    planId: {
      type: String,
    },
    label: {
      type: String,
    },
    price: {
      type: Number,
    },
  }, {collection: "Plans"});

// prettier-ignore
export default mongoose.models.Plan || mongoose.model("Plan", PlanSchema)
import mongoose from "mongoose";
import objectId from "../utils/generateObject";

const { String, ObjectId } = mongoose.Schema.Types;

const UserSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    roles: {
      type: Object,
      required: false,
      default: ["user"],
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    token: {
      type: String,
      required: false,
    },
    location: {
      type: String,
      required: false,
    },
    storeUrl: {
      type: String,
      required: false,
      default: "?"
    },
    mediaUrl: {
      type: String,
      required: false,
    },
    expires: {
      type: Number,
      required: false,
    },
    payoutBalance:{
      type: Number,
      required: false,
      default: 0,
    },
    walkthrough:{
      type: Boolean,
      required: true,
      default: false,
    },
    stripeId:{
      type: String,
      required: false,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);

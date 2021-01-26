import mongoose from "mongoose";

const FeedSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
    },
    user: {
      type: String,
    },
    message: {
      type: String,
    },
    mediaUrl: {
      type: String,
    },
    userUrl: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

// prettier-ignore
export default mongoose.models.Feed || mongoose.model("Feed", FeedSchema);

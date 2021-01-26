import jwt from "jsonwebtoken";
import connectDb from "../../utils/connectDb";
import ActivityFeed from "../../models/ActivityFeed";

connectDb();

export default async (req, res) => {
  try {
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );

    const activityFeeds = await ActivityFeed.find({ user: userId })
      .sort({ createdAt: "desc" }).limit(10);

    res.status(200).json(activityFeeds);
  } catch (error) {
    console.error(error);
    res.status(403).send("Please login again");
  }
};

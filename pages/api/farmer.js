import FarmOrder from "../../models/FarmOrder";
import ActivityFeed from "../../models/ActivityFeed";
import User from "../../models/User";
import objectId from "../../utils/generateObject";
import connectDb from "../../utils/connectDb";

connectDb();

export default async (req, res) => {
  switch (req.method) {
    case "PUT":
      await handlePutRequest(req, res);
      break;
    default:
      res.status(405).send(`Method ${req.method} not allowed`);
      break;
  }
};

async function handlePutRequest(req, res) {
  const { farmer } = req.body;

  // const approveFarmer = await User.findOne({ _id: farmer._id });
  await User.findOneAndUpdate(
    { _id: farmer._id },
    { $set: { roles: ["farmerApproved"] } }
  );
    
  await new ActivityFeed({
    _id: objectId(),
    user: farmer._id,
    message:
      "You have been Approved to sell Products!",
    mediaUrl: null,
  }).save();

  res.status(203).send("Farmer updated");
}

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
  const { order } = req.body;
  const farmerOrder = await FarmOrder.findOne({ _id: order._id });
  const farmer = await User.findById(farmerOrder.farmer);
  
  await FarmOrder.findOneAndUpdate(
    { _id: order._id },
    { $set: { status: order.status } }
  );
    
  await new ActivityFeed({
    _id: objectId(),
    user: farmerOrder.consumerID,
    message:
      farmer.name + 
      " has delivered products with " +
      farmerOrder.total.toFixed(2) +
      " $.",
    mediaUrl: null,
    userUrl: farmer.mediaUrl,
  }).save();

  res.status(203).send("Order updated");
}

import User from "../../models/User";
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
  const { _id, location, mediaUrl, name, storeUrl } = req.body;

  let user = await User.findOne({ _id });
  user.location = location;
  user.name = name;

  if (mediaUrl && mediaUrl != user.mediaUrl) user.mediaUrl = mediaUrl;

  if (storeUrl !== user.storeUrl) {
    let urlCount = await User.count({ storeUrl: storeUrl });
    if (urlCount > 0) res.status(405).send(`The store url is duplicated.`);
  }

  user.storeUrl = storeUrl;
  await user.save();

  res.status(203).send("User updated");
}

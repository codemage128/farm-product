import User from "../../models/User";
import connectDb from "../../utils/connectDb";

connectDb();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await handleGetRequest(req, res);
      break;
    case "POST":
      await handlePostRequest(req, res);
      break;
    case "PUT":
      await handlePutRequest(req, res);
      break;
    case "DELETE":
      await handleDeleteRequest(req, res);
      break;
    default:
      res.status(405).send(`Method ${req.method} not allowed`);
      break;
  }
};

async function handlePutRequest(req, res) {
  const { _id, token, expires } = req.body;
  await User.findOneAndUpdate({ _id }, { token, expires });
  //await console.log('wow',_id)
  res.status(203).send("User updated");
}



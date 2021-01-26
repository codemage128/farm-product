import Plan from "../../models/Plan";
import connectDb from "../../utils/connectDb";
import jwt from "jsonwebtoken";

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

async function handleGetRequest(req, res) {
  try {
    const plan = await Plan.find({});
    res.status(200).json({ plan });
  } catch (error) {
    console.error(error);
    res.status(403).send("Please login again");
  }
}


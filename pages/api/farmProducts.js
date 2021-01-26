import FarmProduct from "../../models/FarmProduct";
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

async function handleGetRequest(req, res){
  if (!("authorization" in req.headers)) {
    return res.status(401).send("No authorization token");
  }
  try {
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );

    var farmProducts = await (await FarmProduct.find({ownerId: userId})).reverse();
    
    res.status(200).json({farmProducts});
  
  } catch (error){
    console.error(error);
    res.status(403).send("Please login again");
}
}

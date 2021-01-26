import Invoice from "../../models/Invoice"
import jwt from "jsonwebtoken"
import connectDb from "../../utils/connectDb"

connectDb();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await handleGetRequest(req, res);
      break;
    case "PUT":
      await handlePutRequest(req, res);
      break;
    default:
      res.status(405).send(`Method ${req.method} not allowed`);
      break;
  }
};

async function handleGetRequest(req, res) {
  try {
    const userId = req.body.theId
    //console.log("USERIDDDDDDD ", userId)
    const invoices = await Invoice.find({userId: userId})
    if (invoices) {
      res.status(200).json(invoices);
    } else {
      res.status(404).send("Invoices not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting invoices")
  }
};

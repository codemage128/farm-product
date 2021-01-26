import User from "../../models/User";
import Customer from "../../models/Customer";
import Invoice from "../../models/Invoice";
import Plan from "../../models/Plan";
import connectDb from "../../utils/connectDb";
import jwt from "jsonwebtoken";

connectDb();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await handleGetRequest(req, res);
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
  if (!("authorization" in req.headers)) {
    return res.status(401).send("No authorization token");
  }
  try {
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    var customers = await Customer.findOne({userId:userId})
    const plans = await Plan.find({})
    const invoices = await Invoice.find({userId:userId})

    if(!customers){
      customers =  {
        card: { brand: 'Card', last4: 'XXXX' },
        subscription: {
          id: 'sub_GPMNLXARlNGwBp',
          status: 'comped',
          plan: 'plan_GFfnHAPnFL0lNu',
          current_period_end: 157720632233
        },
        _id: '123',
        userId: '123',
        customerId: '123',
      }
    }
    
 
//console.log(!(customers))
    
    res.status(200).json({customers, plans, invoices});
  } catch (error) {
    console.error(error);
    res.status(403).send("Please login again");
  }
}
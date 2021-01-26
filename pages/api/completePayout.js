import Stripe from "stripe";
import jwt from "jsonwebtoken";
import User from "../../models/User";
import connectDb from "../../utils/connectDb";
import _ from "underscore";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await handleGetRequest(req, res);
      break;
    case "PUT":
      await handlePutRequest(req, res);
      break;
    case "POST":
      await handlePostRequest(req, res);
      break;
    default:
      res.status(405).send(`Method ${req.method} not allowed`);
      break;
  }
};

async function handlePostRequest(req, res) {
  try {
    // 1) Verify and get user id from token
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    const code = req.body.code;

    connectDb();

    let user = await User.findOne({_id: userId })
    if (user.stripeId){
      return res.status(200).send("already done");
    } else {
      const response = await stripe.oauth.token({
        grant_type: "authorization_code",
        code,
      });
    
      const stripeId = response.stripe_user_id;
      await User.findOneAndUpdate({ _id: userId }, { stripeId });
      return res.status(200).send(response);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing stripe onboarding");
  }
}

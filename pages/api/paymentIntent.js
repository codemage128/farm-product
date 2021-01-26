import Stripe from "stripe";
import uuidv4 from "uuid/v4";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export default async (req, res) => {
  try {
    const cartTotal = Number((req.body.cartTotal * 100).toFixed(2));
    const groupID = "ORDER_" + uuidv4();
    const paymentIntent = await stripe.paymentIntents.create({
      amount: cartTotal,
      currency: "usd",
      payment_method_types: ["card"],
      transfer_group: groupID,
    });
    res.status(200).send({ paymentIntent, groupID });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error processing intent");
  }
};

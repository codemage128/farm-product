import Stripe from "stripe"
import jwt from "jsonwebtoken"
import Customer from "../../models/Customer"
import connectDb from "../../utils/connectDb"

const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

//main API req function

export default async (req, res) => {
  try {
    connectDb()
    // 1) Verify and get user id from token
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    )

    let customer = await Customer.findOne({userId})
    let planId = customer.subscription.id

    // 2) Find cart based on user id, populate it
    const subscription = await handleCancelSubscription(userId, planId)
  
    // 9) Send back success (200) response
    res.status(200).send("Subscription sucessful!")
  } catch (error) {
    console.error(error)
    res.status(500).send("Error processing subscription")
  }
}

//supporting functions

const getCustomer = (userId) => {
  try {
    return Customer.findOne({ userId })
  } catch (exception) {
    console.error(error)
  }
}

const handleCancelSubscription = async (userId) => {
  try {
    const customer = await getCustomer(userId)
    let response = await cancelSubscription(customer.subscription.id)
    let _id = customer._id
    //console.log("CANCELUSER",_id)
    let customerDb = await Customer.updateOne({_id}, {
      $set: {
        // Custom flag as Stripe returns 'active' for subscriptions that cancel at period end.
        // We'll receive a webhook from Stripe at period end with the 'canceled' status.
        // See: /imports/modules/server/stripe/webhooks/customer.subscription.deleted.js.
        'subscription.status': 'cancelling',
        'subscription.current_period_end': response.current_period_end,
      },
    })
  } catch (e) {
    console.log(e)
  }
}

export const cancelSubscription = subscriptionId =>
stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true })
import Stripe from "stripe"
import jwt from "jsonwebtoken"
import Customer from "../../models/Customer"
import connectDb from "../../utils/connectDb"

const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

export default async (req, res) => {
  const planId = req.body.customer

  try {
    connectDb();
    // 1) Verify and get user id from token
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );

    // 2) Find cart based on user id, populate it
    const subscription = await handleChangeSubscription(userId, planId)
  
    // 9) Send back success (200) response
    res.status(200).send("Subscription sucessful!")
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing subscription")
  }
};

const getCustomer = async (userId) => {
  try {
    return await Customer.findOne({ userId })
  } catch (exception) {
    console.error(error)
  }
};

const handleChangeSubscription = async (userId, newPlan) => {
  try {
    const customer = await getCustomer(userId)
    const status = customer.subscription.status
    const hasSubscription = status === 'active' || status === 'trialing' || status === 'cancelling' || status === 'past-due'
    const _id = customer._id
    if (hasSubscription) {
      const change = await changeSubscription(customer.subscription.id, { plan: newPlan, cancel_at_period_end: false })
      const customerUpdated = await Customer.updateOne({_id}, {
        $set: {
          'subscription.id': change.id,
          'subscription.status': change.status,
          'subscription.plan': change.plan.id,
          'subscription.current_period_end': change.current_period_end,
        },
      })
    } else {
      const changeNew = await createSubscription({ customer: customer.customerId, plan: newPlan })
      const customerNew = await Customer.updateOne({_id}, {
        $set: {
          'subscription.id': change.id,
          'subscription.status': change.status,
          'subscription.plan': change.plan.id,
          'subscription.current_period_end': change.current_period_end,
        },
      })
    }
  } catch (e) {
    console.log(e)
  }
};

export const createSubscription = subscription =>
stripe.subscriptions.create(subscription);

export const updateCustomer = (customerId, update) =>
stripe.customers.update(customerId, update)

export const changeSubscription = (subscriptionId, update) =>
stripe.subscriptions.update(subscriptionId, update)
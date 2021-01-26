import Stripe from "stripe"
import jwt from "jsonwebtoken"
import Customer from "../../models/Customer"
import User from "../../models/User"
import connectDb from "../../utils/connectDb"
import objectId from "../../utils/generateObject"

const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

//main API req function

export default async (req, res) => {
  if (!("authorization" in req.headers)) {
    return res.status(401).send("No authorization token");
  }
  try {
    const options = req.body.customer
    connectDb()
    // 1) Verify and get user id from token
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    )
    // 2) Find cart based on user id, populate it
    const subscription = await handleAddPremium(options, userId)
  
    // 9) Send back success (200) response
    res.status(200).send("Subscription sucessful!")
  } catch (error) {
    console.error(error)
    res.status(500).send("Error processing subscription")
  }
};

//supporting functions

const handleAddPremium = async (options, userId) => {
  try {
    //GET REAL USERID and add premium
    const customer = await createCustomerOnStripe({ ...options.user, userId }, options.source)
    const { id, status, items, current_period_end } = await createSubscriptionOnStripe({ userId, customer: customer.id, plan: options.user.plan, trial_from_plan: options.user.trial  })
    
    await Customer.findOneAndDelete({userId: userId})

    const customerDb = await new Customer({
      _id: objectId(),
      userId,
      customerId: customer.id,
      card: { brand: customer.card.brand, last4: customer.card.last4 },
      subscription: { id, status, plan: items.data[0].plan.id, current_period_end },
    }).save()

    const addPremium = await User.findOneAndUpdate(
      { _id: userId }, 
      { $set: {roles: ["premium"] } }
    );
    
  } catch (e) {
    console.log(e)
  }
}

const createSubscriptionOnStripe = ({ customer, plan, trial_from_plan }) => {
  try {
    return createSubscription({ customer, plan, trial_from_plan })
    .then(subscription => subscription)
    .catch(error => error)
  } catch (exception) {
    console.log(exception)
  }
}

const createCustomerOnStripe = ({ userId, profile, email }, source) => {
  try {
    return createCustomer({ email, source, metadata: profile.name })
    .then(({ id, sources }) => {
      const card = sources.data[0]
      return { card, id }
    })
    .catch(error => console.log(error))
  } catch (exception) {
    console.log(exception)
  }
}

//Stripe function

const createCustomer = customer =>
stripe.customers.create(customer)

const createSubscription = subscription =>
stripe.subscriptions.create(subscription)
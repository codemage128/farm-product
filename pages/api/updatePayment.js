import Stripe from "stripe"
import jwt from "jsonwebtoken"
import Customer from "../../models/Customer"
import connectDb from "../../utils/connectDb"

const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

//main API req function

export default async (req, res) => {
  const source = req.body.stripeToken
  if (!("authorization" in req.headers)) {
    return res.status(401).send("No authorization token");
  }
  //console.log(source)
  try {
    connectDb()
    // 1) Verify and get user id from token
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    )

    //console.log("USERID",userId)
    // 2) Find cart based on user id, populate it
    const subscription = await handleChangeSubscription(userId, source)
      
    // 9) Send back success (200) response
    res.status(200).send("Subscription sucessful!")
  } catch (error) {
    console.error(error)
    res.status(500).send("Error processing subscription")
  }
}

//supporting functions

const getCustomer = async (userId) => {
  try {
    return await Customer.findOne({ userId })
  } catch (exception) {
    console.error(error)
  }
};

const handleChangeSubscription = async (userId, source) => {
  try {
    const customer = await getCustomer(userId)
    //console.log("CUSTOMER ", customer.customerId)
    if (customer) {
      let sources = await updateCustomer(customer.customerId,  {source} )
      //onsole.log(sources.sources.data)
      const card = sources.sources.data[0]
      let _id = customer._id
      const customerDb = await Customer.updateOne({_id}, {
        $set: {
          'card.object': card.id,
          'card.brand': card.brand,
          'card.last4': card.last4,
        },
      })
    }
  } catch (e) {
    console.log(e)
  }
}

//Stripe function

export const updateCustomer = (customerId, update) =>
stripe.customers.update(customerId, update)
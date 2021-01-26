/* eslint-disable no-console, consistent-return */

import Customer from '../../../models/Customer'
import User from '../../../models/User'

const customerSubscriptionDeleted = async (webhook) => {
  try {
    const customer = await Customer.findOne({ customerId: webhook.data.object.customer })
    if (customer) {
      let userId = customer.userId
      let customerId = customer._id
      if (webhook.data.object.status == 'canceled'){
        await User.updateOne({_id: userId}, {
          $set: {
            roles: [ 'user' ],
          },
        })
      }
      await Customer.updateOne({customerId}, {
        $set: {
          'subscription.id': '',
          'subscription.plan': '',
          'subscription.current_period_end': '',
          'subscription.status': 'none',
        },
      })
    }
  } catch (exception) {
    console.warn(`[customerSubscriptionDeleted] ${exception}`)
  }
}

export default customerSubscriptionDeleted

/* eslint-disable no-console, consistent-return */

import Customer  from '../../../models/Customer';

const customerSubscriptionUpdated = async (webhook) => {
  try {
    const customer = await Customer.findOne({ customerId: webhook.data.object.customer })
    if (customer) {
      let customerId = customer._id
      let updateDb = await Customer.updateOne({customerId}, {
        $set: {
          'subscription.id': webhook.data.object.id,
          'subscription.status': webhook.data.object.cancel_at_period_end ? 'cancelling' : webhook.data.object.status,
          'subscription.plan': webhook.data.object.plan.id,
          'subscription.current_period_end': webhook.data.object.current_period_end,
        },
      });
    }
  } catch (exception) {
    console.warn(`[customerSubscriptionUpdated] ${exception}`);
  }
};

export default customerSubscriptionUpdated;


import Customer from '../../../models/Customer';
import Invoice from '../../../models/Invoice';
import User from '../../../models/User';
import objectId from '../../../utils/generateObject';

const getDescription = (description, metadata) => {
  try {
    const hasDescription = metadata && metadata.description ? metadata.description : description;
    return hasDescription || 'No description';
  } catch (exception) {
    console.warn(`[invoicePaymentSucceeded.getDescription] ${exception}`);
  }
};

const parseLines = (lines) => {
  try {
    return lines.map(({ amount, description, metadata, period }) => {
      return {
        amount,
        description: getDescription(description, metadata),
        period: {
          start: period.start,
          end: period.end,
        },
      };
    });
  } catch (exception) {
    console.warn(`[invoicePaymentSucceeded.parseLines] ${exception}`);
  }
};

const buildInvoiceFromCharge = (
  { _id },
  { created, paid, amount, description, invoice, period }
) => {
  try {
    return !invoice ? {
      userId: _id,
      created: created,
      paid,
      amount_due: amount,
      subtotal: amount,
      total: amount,
      lines: [{ amount, description, period }],
    } : null;
  } catch (exception) {
    console.warn(`[invoicePaymentSucceeded.buildInvoiceFromCharge] ${exception}`);
  }
};

const buildInvoice = (
  { _id },
  { created, paid, amount_due, subtotal, total, lines }
) => {
  try {
    return {
      productService: 'membership',
      userId: _id,
      created,
      paid,
      amount_due,
      subtotal,
      total,
      lines: parseLines(lines.data),
    };
  } catch (exception) {
    console.warn(`[invoicePaymentSucceeded.buildInvoice] ${exception}`);
  }
};

const invoicePaymentSucceeded = async (webhook) => {
  try {
    let invoice;

    const invoiceType = webhook.data.object.object; // equals 'invoice' or 'charge'
    const invoiceData = webhook.data.object;
    const customerId = invoiceData.customer;
    const customer = await Customer.findOne({ customerId });

    if (customer) {
      const user = await User.findOne(
        { _id: customer.userId }
      );

      if (invoiceType === 'invoice') invoice = buildInvoice(user, invoiceData);
      if (invoiceType === 'charge') invoice = buildInvoiceFromCharge(user, invoiceData);
      if (invoice) {
        const newInvoice = await new Invoice({
          _id: objectId(),
          ...invoice
        }).save();
      }
    } else {
      console.warn(`Customer ${invoiceData.customer} not found.`);
    }
  } catch (exception) {
    console.warn(`[invoicePaymentSucceeded] ${exception}`);
  }
};

export default invoicePaymentSucceeded;

import mongoose from "mongoose";

const { String, Number } = mongoose.Schema.Types;

const InvoiceSchema = new mongoose.Schema(
  {
    _id:{
      type: String,
    },
    userId: {
      type: String,
      required: false,
    },
    created: {
      type: Number,
      required: false,
    },
    paid: {
      type: Boolean,
      required: false,
    },
    amount_due: {
      type: Number,
      required: false,
    },
    subtotal: {
      type: Number,
      required: false,
    },
    total: {
      type: Number,
      label: 'Invoice total',
      required: false,
    },
    lines: {
      type: Object,
      required: false,
    },
    'lines.$': {
      type: Object,
      required: false,
    },
    'lines.$.amount': {
      type: Number,
      required: false,
    },
    'lines.$.description': {
      type: String,
      required: false,
    },
    'lines.$.period': {
      type: Object,
      required: false,
    },
    'lines.$.period.start': {
      type: Number,
      label: 'Start date for the line item (if subscription item).',
      required: false,
    },
    'lines.$.period.end': {
      type: Number,
      label: 'End date for the line item (if subscription item).',
      required: false,
    },
}, {collection: "Invoices"});

// prettier-ignore
export default mongoose.models.Invoice || mongoose.model("Invoice", InvoiceSchema);
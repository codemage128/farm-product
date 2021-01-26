import mongoose from "mongoose";

const { String, Number } = mongoose.Schema.Types;

const ProductSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
  farmer: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: true
  },
  includedProducts: {
    type: Array,
    required: true
  },
  deliveryMethods: {
    type: Array,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  sku: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: Object,
    default: {
      lat: 0.0,
      lng: 0.0
    },
    required: true
  },
  deliveryArea: {
    type: String,
    required: true
  },
  inventoryQuantity: {
    type: Number,
    required: true
  },
  mediaUrl: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: true
  }
});

// prettier-ignore
export default mongoose.models.Product || mongoose.model("Product", ProductSchema);

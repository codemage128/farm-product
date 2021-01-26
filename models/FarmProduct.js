import mongoose from "mongoose";

const { String, Number } = mongoose.Schema.Types;

const FarmProductSchema = new mongoose.Schema({
  _id:{
    type: String,
  },
  ownerId: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  unit:{
    type: String,
    required: true
  }
});

// prettier-ignore
export default mongoose.models.FarmProduct || mongoose.model("FarmProduct", FarmProductSchema);

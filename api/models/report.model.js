import mongoose from "mongoose";
const { Schema } = mongoose;

const reportSchema = new Schema({
  sellerId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  adId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  additionalDetails: {
    type: String,
    required: false,
  },
  selectedReason: {
    type: String,
    default: "nill",
  },
  buyerId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  buyerEmail: {
    type: String,
    required: true,
  },
}, {
  timestamps: true
});

export default mongoose.model("Report", reportSchema);

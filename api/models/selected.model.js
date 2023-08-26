import mongoose from "mongoose";
const { Schema } = mongoose;

const selectedSchema = new Schema({
  appliedId: {
    type: String,
    required: false,
  }
      
}, {
  timestamps: true
});

export default mongoose.model("TemporaryCoverSelect", selectedSchema);

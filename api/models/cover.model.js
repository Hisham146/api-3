import mongoose from "mongoose";
const { Schema } = mongoose;

const coverSchema = new Schema({
  appliedId: {
    type: String,
    required: false,
  },
  cover: {
    type: String,
    required: true,
  },
      
}, {
  timestamps: true
});

export default mongoose.model("Cover", coverSchema);

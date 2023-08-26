import mongoose from "mongoose";
const { Schema } = mongoose;

const serviceSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required:true,
  },
  city: {
    type: String,
    required: true,
  },

  vehiclemake: {
    type: String,
    required: true,
  },

  vehiclemodel: {
    type: String,
    required: true,
  },
  vehiclevarient: {
    type: String,
    required: true,
  },
  serviceType: {
    type: String,
    required: true,
  },
  servicefield: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: false
  },
},
{
  timestamps:true
});

export default mongoose.model("Service", serviceSchema)
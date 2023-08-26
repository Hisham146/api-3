import mongoose from "mongoose";
import { Schema } from "mongoose";

const contactSchema = new Schema ({
    name:{
       type: String,
       required: true
    },
    email:{
        type: String,
        required: true
    },
    query:{
        type: String,
        required: true
    }
},
{
    timestamps: true
});

export default mongoose.model("Contact", contactSchema);

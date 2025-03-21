import { Schema, model } from "mongoose";

const urlSchema = new Schema({
  longUrl: {
    type: String,
    required: true,
    trim: true,
  },
  password:{
    type:String,
    required:false,
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: null,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  qrCode: {
    type: String, 
    default: null,
  },
});

const Url = model("Url", urlSchema);
export default Url;

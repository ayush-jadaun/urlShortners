import { Schema, model } from "mongoose";

const urlSchema = new Schema({
  longUrl: {
    type: String,
    required: true,
    trim: true,
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
});


const Url = model("Url", urlSchema);
export default Url;

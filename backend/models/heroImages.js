import mongoose from "mongoose";

const heroImageSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true }, // URL from cloud / base64 / file server
  isActive: { type: Boolean, default: true }, // active/inactive toggle
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("HeroImage", heroImageSchema);

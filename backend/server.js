import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();
const app = express();

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Serve images
app.use("/uploads", express.static(path.join(__process.cwd(), "public/uploads")));

// Routes
app.use("/api/products", productRoutes);

// Connect MongoDB & Start Server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));
  })
  .catch(err => console.log(err));

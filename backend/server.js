import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";


import searchRoutes from "./routes/searchRoutes.js"
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js"


dotenv.config();
const app = express();

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Serve images
app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/search", searchRoutes);

// Handle unknown routes with 404 JSON response
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Connect MongoDB & Start Server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(5000, () => console.log("✅ Server running"));
  })
  .catch(err => console.log(err));

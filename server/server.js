import dotenv from "dotenv";
console.log("🔥 SERVER.JS FILE IS RUNNING");
dotenv.config(); // MUST be first

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import dashboardRoutes from "./routes/dashboardRoutes.js";
import aiRoutes from "./routes/ai.routes.js"; // ✅ MISSING IMPORT

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/dashboards", dashboardRoutes);
app.use("/api/ai", aiRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

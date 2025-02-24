import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import connectDB from "./config/db.js";
import { ApiError } from "./utils/apiError.js";
import { ApiResponse } from "./utils/apiResponse.js";

dotenv.config();
const app = express();

// Connect to Database
connectDB();

const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json()); // ✅ Allows parsing JSON requests

// Routes
app.use("/", userRoutes);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Global Error:", err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(new ApiResponse(err.statusCode, null, err.message));
  }

  return res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

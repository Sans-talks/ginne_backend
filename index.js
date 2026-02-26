import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";

dotenv.config();
connectDB();

const app = express();

// CORS configuration
const FRONTEND_ORIGIN = "https://ginne-frontend-rjm2il6hh-sans-talks-projects.vercel.app";
// Toggle for testing: set CORS_ALLOW_ALL=true in env to allow any origin temporarily
const allowAll = process.env.CORS_ALLOW_ALL === "true";

const corsOptions = {
  origin: allowAll ? true : FRONTEND_ORIGIN,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
// Ensure preflight requests are handled for all routes
app.options("*", cors(corsOptions));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);


// (Optional) Remove this if not needed
// app.use("/products", productRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

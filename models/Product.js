import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    basePrice: Number,
    gst: Number,
    profitMargin: Number,
    discount: Number,
    category: { type: String, required: true },
    subCategory: String,
    brand: String,
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [
      {
        name: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        date: { type: Date, default: Date.now }
      }
    ],
    stock: { type: Number, default: 10 },
    images: [String]
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);


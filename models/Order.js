import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: Number,
        price: Number
      }
    ],
    totalAmount: Number,
    address: Object,
    paymentMethod: String,
    status: { type: String, default: "Placed" }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);

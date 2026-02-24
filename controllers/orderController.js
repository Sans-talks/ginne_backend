import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

// 🔹 Place Order
export const placeOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const order = await Order.create({
      user: req.user._id,
      items: cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      })),
      totalAmount: cart.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      ),
      address: req.body.address,
      paymentMethod: req.body.paymentMethod
    });

    // ✅ Clear cart after order
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    console.error("Order Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Get User Orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

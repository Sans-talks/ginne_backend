import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// ➕ Add product to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, qty } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "productId required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const quantity = Math.max(1, Number(qty) || 1);

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // ✅ Prevent duplicate items
    const existing = cart.items.find(
      (i) => i.product.toString() === productId
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    await cart.populate("items.product");

    res.json({ items: cart.items });
  } catch (error) {
    console.error("Add To Cart Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🛒 Get cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

    // ✅ Always return consistent structure
    res.json(cart ? { items: cart.items } : { items: [] });
  } catch (error) {
    console.error("Get Cart Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔄 Update quantity
export const updateQty = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { change } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity = Math.max(1, item.quantity + Number(change || 0));

    await cart.save();
    await cart.populate("items.product");

    res.json({ items: cart.items });
  } catch (error) {
    console.error("Update Qty Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ❌ Remove item
export const removeItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.remove();
    await cart.save();
    await cart.populate("items.product");

    res.json({ items: cart.items });
  } catch (error) {
    console.error("Remove Item Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

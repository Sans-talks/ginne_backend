import User from "../models/User.js";
import Cart from "../models/Cart.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ================= REGISTER ================= */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user"
    });

    // Create an empty cart for the new user so the collection exists in MongoDB
    try {
      await Cart.create({ user: user._id, items: [] });
    } catch (err) {
      console.error("Failed to create cart for new user:", err);
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({
  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role   // must come from DB
  },
  token
});


  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= LOGIN ================= */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

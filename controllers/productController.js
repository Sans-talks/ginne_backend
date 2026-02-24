import Product from "../models/Product.js";

//
// 🔹 Add Product (Admin only)
//
export const addProduct = async (req, res) => {
  try {
    const { name, description, price, basePrice, gst, profitMargin, discount, category, subCategory, images } = req.body;

    if (!name || price === undefined || !category) {
      return res.status(400).json({
        message: "Name, price, and category are required"
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      basePrice,
      gst,
      profitMargin,
      discount,
      category,
      subCategory,
      images
    });

    res.status(201).json(product);

  } catch (error) {
    console.error("Add Product Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//
// 🔹 Get All Products (Public)
//
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);

  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//
// 🔹 Update Product (Admin)
//
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, basePrice, gst, profitMargin, discount, category, subCategory, images } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, basePrice, gst, profitMargin, discount, category, subCategory, images },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);

  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//
// 🔹 Delete Product (Admin)
//
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });

  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

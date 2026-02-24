import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import connectDB from "./config/db.js";

dotenv.config();

const products = [
    // MEN
    {
        name: "Classic Navy Blazer",
        description: "Premium cotton-rich blazer with a refined tailored fit. Features a notched lapel, two-button closure, and multiple internal pockets. Ideal for office wear and formal events.",
        basePrice: 4500,
        gst: 18,
        profitMargin: 25,
        discount: 10,
        price: 5400,
        category: "Men",
        subCategory: "Blazers",
        images: [
            "https://images.unsplash.com/photo-1594932224010-749e7a2b9a14?auto=format&fit=crop&w=800&h=1066",
            "https://images.unsplash.com/photo-1598808503746-f34c53b47bf3?auto=format&fit=crop&w=800&h=1066"
        ]
    },
    {
        name: "Slim Fit Indigo Jeans",
        description: "Dark-washed stretch denim for all-day comfort. Features five-pocket styling and reinforced stitching at stress points.",
        basePrice: 2200,
        gst: 12,
        profitMargin: 20,
        discount: 15,
        price: 2500,
        category: "Men",
        subCategory: "Jeans",
        images: [
            "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&h=1066",
            "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&h=1066"
        ]
    },
    {
        name: "Urban Leather Sneakers",
        description: "Handcrafted top-grain leather sneakers with a cushioned footbed for maximum comfort. Minimalist white design that pairs with everything.",
        basePrice: 3800,
        gst: 18,
        profitMargin: 30,
        discount: 5,
        price: 5200,
        category: "Men",
        subCategory: "Sneakers",
        images: [
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&h=1066",
            "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&h=1066"
        ]
    },

    // WOMEN
    {
        name: "Emerald Silk Saree",
        description: "Exquisite hand-woven silk saree with intricate golden zari borders. Perfect for weddings and festive occasions. Comes with an unstitched blouse piece.",
        basePrice: 6500,
        gst: 12,
        profitMargin: 40,
        discount: 10,
        price: 9500,
        category: "Women",
        subCategory: "Traditional",
        images: [
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&h=1066",
            "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=800&h=1066"
        ]
    },
    {
        name: "Floral Summer Day Dress",
        description: "Lightweight cotton dress with a vintage-inspired floral print. Features a tiered skirt and adjustable tie-straps for the perfect fit.",
        basePrice: 1800,
        gst: 12,
        profitMargin: 25,
        discount: 20,
        price: 2200,
        category: "Women",
        subCategory: "Western",
        images: [
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&h=1066",
            "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&h=1066"
        ]
    },
    {
        name: "Rose Gold Pendant Set",
        description: "Elegant necklace and earring set crafted in rose gold plated silver, featuring shimmering AAA+ zircon stones.",
        basePrice: 1200,
        gst: 3,
        profitMargin: 50,
        discount: 10,
        price: 1800,
        category: "Women",
        subCategory: "Jewellery",
        images: [
            "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&h=1066",
            "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&h=1066"
        ]
    },

    // KIDS
    {
        name: "Super Hero Graphic Hoodie",
        description: "Soft fleece-lined hoodie featuring vibrant graphic prints. Ribbed cuffs and hem for a snug fit. Machine washable and durable.",
        basePrice: 850,
        gst: 12,
        profitMargin: 20,
        discount: 5,
        price: 1100,
        category: "Kids",
        subCategory: "Boys Fashion",
        images: [
            "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&h=1066",
            "https://images.unsplash.com/photo-1519232954913-bc6702674272?auto=format&fit=crop&w=800&h=1066"
        ]
    },
    {
        name: "Unicorn Tulle Party Dress",
        description: "Enchanting multi-layered tulle dress with sparkling unicorn embroidery on the bodice. Ideal for birthdays and celebrations.",
        basePrice: 1500,
        gst: 12,
        profitMargin: 25,
        discount: 15,
        price: 1950,
        category: "Kids",
        subCategory: "Girls Fashion",
        images: [
            "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&h=1066",
            "https://images.unsplash.com/photo-1621454523226-eb3013c77d61?auto=format&fit=crop&w=800&h=1066"
        ]
    },

    // HOME & LIVING
    {
        name: "Egyptian Cotton Bed Linen",
        description: "Luxurious 600-thread count Egyptian cotton sheets set for the ultimate sleep experience. Includes one flat sheet and two pillowcases.",
        basePrice: 2800,
        gst: 12,
        profitMargin: 30,
        discount: 10,
        price: 3600,
        category: "Home & Living",
        subCategory: "Bed Linen",
        images: [
            "https://images.unsplash.com/photo-1582582621959-48d27397dc69?auto=format&fit=crop&w=800&h=1066",
            "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&h=1066"
        ]
    },
    {
        name: "Minimalist Ceramic Lamp",
        description: "Modern matte ceramic table lamp with a natural linen shade. Adds a warm, ambient glow to any living space or bedroom.",
        basePrice: 1600,
        gst: 18,
        profitMargin: 30,
        discount: 5,
        price: 2400,
        category: "Home & Living",
        subCategory: "Decor",
        images: [
            "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&h=1066",
            "https://images.unsplash.com/photo-1507473885765-e6ed605169ee?auto=format&fit=crop&w=800&h=1066"
        ]
    }
];

const seedDB = async () => {
    try {
        await connectDB();
        console.log("Database connected for seeding...");

        // Clear existing products
        await Product.deleteMany({});
        console.log("Existing products cleared.");

        // Insert new products
        await Product.insertMany(products);
        console.log(`${products.length} products successfully seeded!`);

        process.exit(0);
    } catch (err) {
        console.error("Seeding Error:", err);
        process.exit(1);
    }
};

seedDB();

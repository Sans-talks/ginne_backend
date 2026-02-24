import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import connectDB from "./config/db.js";

dotenv.config();

const categories = {
    "Men": {
        subCategories: ["T-Shirts", "Shirts", "Jeans", "Shoes", "Watches"],
        brands: ["Ginne Man", "Urban Fit", "Denim Co.", "Peak Performance", "Classic Elite", "Street Pulse"],
    },
    "Women": {
        subCategories: ["Dresses", "Tops", "Handbags", "Heels", "Jewellery"],
        brands: ["Ginne Grace", "Ethereal", "Vogue Aura", "Bloom & Belle", "Silk Route", "Chic Haven"],
    },
    "Kids": {
        subCategories: ["Kids T-Shirts", "Kids Shoes", "Toys", "School Bags"],
        brands: ["Ginne Junior", "Tiny Toes", "Kiddo Cloud", "Play Mate", "Wonder Joy"],
    },
    "Home & Living": {
        subCategories: ["Bedsheets", "Wall Clock", "Lamp", "Curtains", "Decor"],
        brands: ["Ginne Home", "Loom & Leaf", "Aura Living", "Nook Nest", "Earthy Abode"],
    }
};

const subCategoryImageMap = {
    "T-Shirts": "1521572163474-6864f9cf17ab",
    "Shirts": "1603252109303-2751441dd157",
    "Jeans": "1542272604-787c3835535d",
    "Shoes": "1542291026-7eec264c27ff",
    "Watches": "1523275335684-37898b6baf30",
    "Dresses": "1595777457583-95e059d581b8",
    "Tops": "1520975922203-bd0b3a6b4a1b",
    "Handbags": "1584917865442-de89df76afd3",
    "Heels": "1528701800489-20be3c0e0e5a",
    "Jewellery": "1515562141207-7a88fb7ce338",
    "Kids T-Shirts": "1519681393784-d120267933ba",
    "Kids Shoes": "1600185365483-26d7a4cc7519",
    "Toys": "1589254065878-42c9da997008",
    "School Bags": "1588072432836-e10032774350",
    "Bedsheets": "1582582621959-48d27397dc69",
    "Wall Clock": "1509042239860-f550ce710b93",
    "Lamp": "1507473885767-e6ed057f782c",
    "Curtains": "1560185127-6ed189bf02f4",
    "Decor": "1524758631624-e2822e304c36"
};

const reviewsPool = [
    "Absolutely love this! Great quality.",
    "Value for money. Fits perfectly.",
    "The material is okay but the color is slightly different.",
    "Fast delivery and amazing packaging.",
    "Not what I expected, but still usable.",
    "Excellent craftsmanship. Highly recommended.",
    "Five stars for the design alone!",
    "A bit expensive but worth it for the premium feel.",
    "Good for daily use.",
    "My favorite purchase of the month!"
];

const reviewerNames = ["Rahul S.", "Priya M.", "Anish K.", "Sneha V.", "John D.", "Sara P.", "Amit R.", "Vikram G.", "Neha L.", "Rohan B."];

const generateProducts = () => {
    const products = [];
    const catNames = Object.keys(categories);

    for (let i = 0; i < 105; i++) {
        const categoryName = catNames[i % catNames.length];
        const catData = categories[categoryName];
        const subCategory = catData.subCategories[Math.floor(Math.random() * catData.subCategories.length)];
        const brand = catData.brands[Math.floor(Math.random() * catData.brands.length)];

        const basePrice = Math.floor(Math.random() * (5000 - 500) + 500);
        const gst = [5, 12, 18][Math.floor(Math.random() * 3)];
        const profitMargin = Math.floor(Math.random() * (40 - 15) + 15);
        const discount = [0, 5, 10, 15, 20, 25][Math.floor(Math.random() * 6)];

        const priceWithMargin = basePrice * (1 + (profitMargin + gst) / 100);
        const finalPrice = Math.round(priceWithMargin * (1 - discount / 100) / 10) * 10;

        const numReviews = Math.floor(Math.random() * 6);
        const productReviews = [];
        let totalRating = 0;
        for (let j = 0; j < numReviews; j++) {
            const rRating = Math.floor(Math.random() * (5 - 3 + 1)) + 3;
            totalRating += rRating;
            productReviews.push({
                name: reviewerNames[Math.floor(Math.random() * reviewerNames.length)],
                rating: rRating,
                comment: reviewsPool[Math.floor(Math.random() * reviewsPool.length)],
                date: new Date(Date.now() - Math.floor(Math.random() * 1000000000))
            });
        }

        const imageId = subCategoryImageMap[subCategory] || "1523275335684-37898b6baf30";

        products.push({
            name: `${brand} ${subCategory}`,
            description: `Premium quality ${subCategory.toLowerCase()} from ${brand}. Designed for comfort and lasting style, this piece is a versatile addition to your ${categoryName.toLowerCase()} wardrobe.`,
            basePrice,
            gst,
            profitMargin,
            discount,
            price: finalPrice,
            category: categoryName,
            subCategory,
            brand,
            stock: Math.floor(Math.random() * 101),
            rating: numReviews > 0 ? parseFloat((totalRating / numReviews).toFixed(1)) : 0,
            numReviews,
            reviews: productReviews,
            images: [
                `https://images.unsplash.com/photo-${imageId}?auto=format&fit=crop&w=800&h=1066&q=80`,
                `https://images.unsplash.com/photo-${imageId}?auto=format&fit=crop&w=800&h=1066&q=80`
            ]
        });
    }
    return products;
};

const seedBulkDB = async () => {
    try {
        await connectDB();
        console.log("Database connected for bulk seeding...");

        // Clear existing products for a clean reseed
        await Product.deleteMany({});
        console.log("Existing products cleared for clean reseed.");

        const bulkProducts = generateProducts();
        await Product.insertMany(bulkProducts);
        console.log(`${bulkProducts.length} bulk products successfully added!`);

        process.exit(0);
    } catch (err) {
        console.error("Bulk Seeding Error:", err);
        process.exit(1);
    }
};

seedBulkDB();

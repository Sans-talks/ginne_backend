import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import connectDB from "./config/db.js";

dotenv.config();

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

const fixImages = async () => {
    try {
        await connectDB();
        console.log("Database connected for image URL migration...");

        const products = await Product.find({});
        console.log(`Found ${products.length} products to check.`);

        let updatedCount = 0;

        for (const product of products) {
            const imageId = subCategoryImageMap[product.subCategory] || "1523275335684-37898b6baf30";
            const stableUrl = `https://images.unsplash.com/photo-${imageId}?auto=format&fit=crop&w=800&h=1066&q=80`;

            // Set both images in the array to the stable category image
            product.images = [stableUrl, stableUrl];
            await product.save();
            updatedCount++;
        }

        console.log(`Successfully updated image URLs for ${updatedCount} products with category-specific imagery.`);
        process.exit(0);
    } catch (err) {
        console.error("Migration Error:", err);
        process.exit(1);
    }
};

fixImages();

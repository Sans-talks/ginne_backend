import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected ✅");
    console.log("Database Name 👉", mongoose.connection.name);
    console.log("Host 👉", mongoose.connection.host);
    console.log("DB Name:", mongoose.connection.name);
    console.log("DB Port:", mongoose.connection.port);

  } catch (error) {
    console.error("MongoDB Connection Failed ❌", error.message);
    process.exit(1);
  }
};

export default connectDB;

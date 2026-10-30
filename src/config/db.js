import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    if (process.env.NODE_ENV !== "test") {
      console.log("Base de datos conectada");
    }
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error.message);
    process.exit(1);
  }
};

export { connectDB };

import express from "express";
import cors from "cors";
import path from "path";
import { errorHandler } from "./middlewares/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import productionRoutes from "./routes/productionRoutes.js";
import mealRoutes from "./routes/mealsRoutes.js";
import suppliesRoutes from "./routes/suppliesRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import cookieParser from "cookie-parser";
import "dotenv/config";

const app = express();

console.log(process.env.FRONTEND_URL);
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use("/uploads", express.static(path.resolve("uploads")));
app.use(express.json());
app.use(cookieParser());

app.use("/api", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/production", productionRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/supplies", suppliesRoutes);
app.use("/api/users", usersRoutes);

app.get("/api/ping", (req, res) => {
  res.json({ mensaje: "Backend de Bruma Cocina funcionando" });
});

app.use(errorHandler);

export default app;

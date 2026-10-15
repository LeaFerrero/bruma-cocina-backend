import express, { response } from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler.js";
import usersRoutes from "./routes/usersRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/users", usersRoutes);
app.use("/api", authRoutes);

app.get("/api/ping", (req, res) => {
  res.json({ mensaje: "Backend de Bruma Cocina funcionando" });
});

app.use(errorHandler);

export default app;

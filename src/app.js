import express, { response } from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler.js";
import usersRoutes from "./routes/usersRoutes.js";
import authRoutes from "./routes/usersRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", usersRoutes);
app.use("/api/login", authRoutes);

app.get("/api/ping", (req, res) => {
  res.json({ mensaje: "Backend de Bruma Cocina funcionando" });
});

app.use(errorHandler);

export default app;

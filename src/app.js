import express, { response } from "express";
import cors from "cors";
const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/ping", (req, res) => {
  res.json({ mensaje: "Backend de Bruma Cocina funcionando" });
});

export default app;

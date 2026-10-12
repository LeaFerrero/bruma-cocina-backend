import dotenv from "dotenv";
import { connectDB } from "../src/config/db.js";
import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const httpServer = createServer(app);
const io = new Server(httpServer);

await connectDB();

const server = httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`El puerto ${PORT} ya está siendo usado por otro programa.`);
  } else {
    console.error("Error inesperado en el servidor:", err);
  }
});

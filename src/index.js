import "dotenv/config";
import { connectDB } from "../src/config/db.js";
import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app.js";

const PORT = process.env.PORT || 3000;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.set("io", io);

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

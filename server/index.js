const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

const userRoute = require("./routes/userRoute");
const chatRoute = require("./routes/chatRoute");
const messageRoute = require("./routes/messageRoute");

const app = express();
require("dotenv").config();

// Middleware
app.use(express.json());
app.use(cors());

// Rutas del API
app.use("/users", userRoute);
app.use("/chats", chatRoute);
app.use("/messages", messageRoute);

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("¡Bienvenido!");
});

// Conectar a la base de datos MongoDB
const uri = process.env.ATLAS_URI;
mongoose
  .connect(uri)
  .then(() => console.log("MongoDB conexion establecida"))
  .catch((error) => console.log("MongoDB conexion fallida: ", error.message));

// Crear servidor HTTP
const server = http.createServer(app);

// Configurar Socket.IO
const io = new Server(server, {
  cors: {
    origin: "chatweb-hjjc2hcwx-jair-viloria-bertels-projects.vercel.app",
  },
});

// Almacén de usuarios en línea
let onlineUsers = [];

// Manejo de eventos de Socket.IO
io.on("connection", (socket) => {
  console.log("new connection", socket.id);

  // Escuchar evento para añadir usuario en línea
  socket.on("addNewUser", (userId) => {
    !onlineUsers.some((user) => user.userId === userId) &&
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });

    console.log("onlineUsers", onlineUsers);

    io.emit("getOnlineUsers", onlineUsers);
  });

  // Manejar envío de mensajes
  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find(
      (user) => user.userId === message.recipientId
    );

    if (user) {
      io.to(user.socketId).emit("getMessage", message);
    }
  });

  // Manejar desconexión
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });
});

// Puerto para el servidor
const port = process.env.PORT || 5000;

// Iniciar el servidor
server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

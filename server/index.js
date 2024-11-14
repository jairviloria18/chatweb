const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoute");
const chatRoute = require("./routes/chatRoute");
const messageRoute = require("./routes/messageRoute");

const app = express();
require("dotenv").config();

app.use(express.json());
app.use(cors());
app.use("/users", userRoute);
app.use("/chats", chatRoute);
app.use("/messages", messageRoute);

//CRUD
app.get("/", (req, res) => {
  res.send("¡Bienvenido!");
});

const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;

app.listen(port, (req, rest) => {
  console.log(`Server running on port: ${port}`);
});

//CONECTAR DB
mongoose
  .connect(uri)
  .then(() => console.log("MongoDB conexion establecida"))
  .catch((error) => console.log("MongoDB conexion fallida: ", error.message));

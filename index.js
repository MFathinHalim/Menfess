/*
 * Hello, My name is M.Fathin Halim/Doma Tomoharu. This is code for my Application called "Menfess"! :D 
 * Halo, gw Min Akhilkariim Ziddan/Gorengan Hunter. Commit dikit ga ngaruh
 */

// Pake nanya, import package dulu lah
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

// Import router
const apiRouter = require("./routes/api.js")

// Bikin app nya
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }
});

// Setup dikit
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cuman naruh socket.io di req biar bisa diakses di router
app.use((req, res, next) => {
  req.io = io
  next()
})

// Pake router nya
app.use("/api", apiRouter)

const port = 5000;

// Jalanin Backend nya. Frontend di folder terpisah
server.listen(port, async () => {
  console.log("App running on port", port);
  // Connect MongoDB
  mongoose.connect(process.env.MONGODBURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Naikin timeout nya karena biasanya kalo di replit lama keburu timeout
  });
});

//! © The script created by M.Fathin Halim(Doma Tomoharu), Min Akhilkariim Ziddan(Gorengan Hunter)
//? If you want copy it, you need to change it and you cant use ALL my script to your apps:/ Copas dikit ga ngaruh yang penting jan semua jir

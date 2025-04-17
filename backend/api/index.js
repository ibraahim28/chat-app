const express = require("express");
const { app, server } = require("../src/lib/socket");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("../src/lib/db");
const authRouter = require("../src/routers/authRouter");
const userRouter = require("../src/routers/userRouter");
const messageRouter = require("../src/routers/messageRouter");
const protectRoute = require("../src/middlewares/protectRoute");

app.use(
  cors({
    origin: "https://chatmore-ibra.netlify.app",
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://chatmore-ibra.netlify.app");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});


app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/auth", authRouter);
app.use("/users", protectRoute, userRouter);
app.use("/messages", protectRoute, messageRouter);

app.get("/", (req, res)=>{
  res.send("Backend is working")
})

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//   console.log("App running in port: " + PORT);
//   connectDB();
// });

module.exports = app;
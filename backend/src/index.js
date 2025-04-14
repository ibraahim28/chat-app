const express = require("express");
const { app, server } = require("./lib/socket");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./lib/db");
const authRouter = require("./routers/authRouter");
const userRouter = require("./routers/userRouter");
const messageRouter = require("./routers/messageRouter");
const protectRoute = require("./middlewares/protectRoute");
const path = require('path');

const __dirname = path.resolve();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/auth", authRouter);
app.use("/users", protectRoute, userRouter);
app.use("/messages", protectRoute, messageRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")))

  app.get('*', (req,res)=>{
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
  })
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log("App running in port: " + PORT);
  connectDB();
});

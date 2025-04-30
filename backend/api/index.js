const express = require("express");
const { app, server } = require("../src/lib/socket");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("../src/lib/db");
const authRouter = require("../src/routers/authRouter");
const userRouter = require("../src/routers/userRouter");
const messageRouter = require("../src/routers/messageRouter");
const protectRoute = require("../src/middlewares/protectRoute");


app.use(express.json());
const allowedOrigins = ["https://chatmore-ibra.netlify.app", "http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


app.use("/uploads", express.static("uploads"));
app.use("/auth", authRouter);
app.use("/users", protectRoute, userRouter);
app.use("/messages", protectRoute, messageRouter);

app.get("/", (req, res)=>{
  res.send("Backend is working")
})

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log("App running in port: " + PORT);
  connectDB();
});

module.exports = app;
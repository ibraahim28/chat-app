const express = require("express");
const {
  createUser,
  loginUser,
  checkAuth,
} = require("../controllers/authController");
const protectRoute = require("../middlewares/protectRoute");
const router = express.Router();

router.post("/signup", createUser);
router.post("/signin", loginUser);
router.get("/check", protectRoute, checkAuth);

module.exports = router;

const { generateToken } = require("../utils/generateToken");
const { hashPassword, comparePasswords } = require("../utils/bcryptMethods");
const User = require("../models/user.model");
const cloudinary = require("../../src/lib/cloudinary");

const createUser = async (req, res) => {
  try {
    const { username, email, password, profilePicture } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({
        success: false,
        message: "please provide all the details required",
      });
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser)
      return res
        .status(400)
        .json({ success: false, message: "Username or email already taken" });
    const hashedPassword = await hashPassword(password);
    let profilePic;
    if (profilePicture) {
      profilePic = await cloudinary.uploader.upload(profilePicture);
    }

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      profilePicture: profilePic || '',
    });
    const token = generateToken({ id: user._id });

    res.status(200).json({ success: true, data: user, token });
  } catch (error) {
    res.status(500).send({ success: false, message: error?.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required details",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const isMatch = await comparePasswords(password, user.password);
    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, message: "Incorrect credentials" });

    const token = generateToken({ id: user._id });

    const sanitizedUser = {
      _id: user._id,
      email: user.email,
      username: user.username,
    };
    res.status(200).json({ success: true, data: sanitizedUser, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ success: false, message: error?.message });
  }
};

module.exports = {
  createUser,
  loginUser,
  checkAuth,
};

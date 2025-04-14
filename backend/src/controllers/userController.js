const  cloudinary = require("../lib/cloudinary");
const User = require("../models/user.model")

const getAllUsers = async (req,res) => {
    try {
        const users = await User.find({});
        
        res.status(200).json({success : true, data : users})

    } catch (error) {
        console.error(error)
        res.status(500).json({success : false, message : error?.message})
    }
}

const getUserById = async (req,res) => {
    try {
        const userToGet = req.params.id;
        if (!userToGet) {
            res.status(400).json({success : false, message : "Something went wrong. Please try again"})
        }
        const fetchedUser = await User.findOne({_id : userToGet});
        if (!fetchedUser) {
            res.status(404).json({success : false, message : 'User does not exist!'})
        }
        res.status(200).json({success : true, data : fetchedUser})
    } catch (error) {
        console.error(error)
        res.status(500).json({success : false, message : error?.message})
    }
}

 const updateProfile = async (req, res) => {
    try {
      const { profilePic } = req.body;
      const userId = req.user._id;
  
      if (!profilePic) {
        return res.status(400).json({ message: "Profile pic is required" });
      }
  
      const uploadResponse = await cloudinary.uploader.upload(profilePic);
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePicture: uploadResponse.secure_url },
        { new: true }
      );
  
      res.status(200).json(updatedUser);
    } catch (error) {
      console.log("error in update profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };


module.exports = {
    getAllUsers,
    getUserById,
    updateProfile
}
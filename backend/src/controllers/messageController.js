const mongoose = require("mongoose");
const Message = require("../models/message.model");
const cloudinary = require("../lib/cloudinary");
const { io, getReceiverSocketId } = require("../lib/socket");

const getAllMessages = async (req, res) => {
  try {
    const { id: userToChatWith } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: userToChatWith },
        { sender: userToChatWith, receiver: myId },
      ],
    });

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error?.message });
  }
};
const sendMessage = async (req, res) => {
  try {
    const myId = new mongoose.Types.ObjectId(req.user._id); // Convert to ObjectId
    const { id } = req.params;
    const userToChatWith = new mongoose.Types.ObjectId(id); // Convert to ObjectId
    const { text, media } = req.body;

    let mediaUrl;

    if (media) {
      const uploadResponse = await cloudinary.uploader.upload(media);
      mediaUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      sender: myId,
      receiver: userToChatWith,
      text,
      media: mediaUrl,
    });

    const receiverSocketId = getReceiverSocketId(userToChatWith.toString());

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", {
        newMessage,
      });
    }

    res
      .status(201)
      .json({ message: "Message sent successfully", data: newMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error?.message });
  }
};

module.exports = {
  getAllMessages,
  sendMessage,
};

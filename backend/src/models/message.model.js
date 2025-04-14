const mongoose = require('mongoose');


const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
    },
    media: {
        type: String,
    }
}, { timestamps: true });

const Message = mongoose.model("message", messageSchema)

module.exports = Message;
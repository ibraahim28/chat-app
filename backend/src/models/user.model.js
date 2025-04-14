const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: [true, "This username is already taken"],
        maxlength: [18, "Username must be 16 characters or below"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "This email is already in use"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be 6 characters or longer"],
        select: false,
    },
    contacts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    profilePicture: {
        type: String,
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User

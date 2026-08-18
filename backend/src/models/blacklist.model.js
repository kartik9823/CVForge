const mongoose = require("mongoose");

const blacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: ["true", "Token is required"]
    },
    timestamp: {
        type: Date,
        default: Date.now(),
    }
})

const tokenBlacklistModel = mongoose.model("blacklistToken", blacklistSchema);

module.exports = tokenBlacklistModel;
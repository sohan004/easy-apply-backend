const { default: mongoose } = require("mongoose");
const { db } = require("../db.config");

module.exports = db.model('Otp', new mongoose.Schema({
    otp: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    expireAt: {
        type: Date,
        default: Date.now,
        index: { expires: 180 },
    }
}))
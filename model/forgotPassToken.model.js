const { default: mongoose } = require("mongoose");
const { db } = require("../db.config");

module.exports = db.model('ForgotPassToken', new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    expireAt: {
        type: Date,
        default: Date.now,
        index: { expires: 600 },
    }
},{
    timestamps: true
}) )
const { default: mongoose } = require("mongoose");
const { db } = require("../db.config");

module.exports = db.model(
  "User",
  new mongoose.Schema(
    {
      email: {
        type: String,
        required: true,
        unique: true,
      },
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      profilePicture: {
        type: String,
        default: "user-default.png",
      },
      address: {
        type: String,
      },
      emailAppPass: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      refreshToken: {
        type: String,
      },
    },
    {
      timestamps: true,
    }
  )
);

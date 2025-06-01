const { default: mongoose } = require("mongoose");
const { db } = require("../db.config");

module.exports = db.model(
  "Attachment",
  new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      template: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Template",
        required: true,
      },
      fileName: {
        type: String,
        required: true,
      },
      filePath: {
        type: String,
        required: true,
      },
      fileSize: {
        type: Number, // Size in bytes
        required: true,
      },
      fileType: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  )
);

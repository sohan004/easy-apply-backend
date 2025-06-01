const { default: mongoose } = require("mongoose");
const { db } = require("../db.config");

module.exports = db.model(
  "Template",
  new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      templateName: {
        type: String,
        required: true,
      },
      subject: {
        type: String,
        required: true,
      },
      body: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  )
);

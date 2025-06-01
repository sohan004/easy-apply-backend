const { default: mongoose } = require("mongoose");
const { db } = require("../db.config");

module.exports = db.model(
  "Mail",
  new mongoose.Schema(
    {
      to: {
        type: String,
        required: true,
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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
      attachments: [
        {
          filename: {
            type: String,
            required: true,
          },
          filePath: {
            type: String,
            required: true,
          },
        },
      ],
      hint: {
        type: String,
      },
    },
    {
      timestamps: true,
    }
  )
);

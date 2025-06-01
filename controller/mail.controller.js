const { createTransport } = require("nodemailer");
const { User, Mail } = require("../model");
const path = require("path");
const asyncErrorCatcher = require("../middleware/asyncErrorCatcher");

module.exports.sendMail = asyncErrorCatcher(async (req, res) => {
  const files = (await req?.files) || [];
  const {
    to,
    subject,
    body,
    attachments = [],
    hint = "",
  } = await JSON.parse((await req?.body?.data) || "{}");
  const userId = await req?.user?.id;
  const user = await User.findById(userId);
  const mailAttachment = await [...files, ...attachments];

  if (!user) {
    return res.status(404).json({
      message: "User not found",
      success: false,
    });
  }

  const transporter = createTransport({
    service: "gmail",
    auth: {
      user: user?.email,
      pass: user?.emailAppPass,
    },
  });

  const mailOptions = {
    from: user?.email,
    to: to,
    subject: subject,
    html: body,
    attachments: mailAttachment.map((file) => ({
      filename: file?.fileName,
      path: path.resolve(__dirname, "..", "media", file?.filePath),
    })),
  };

  try {
    await transporter.sendMail(mailOptions);
    const saveMail = await new Mail({
      to,
      user: userId,
      subject,
      body,
      attachments: mailAttachment.map((file) => ({
        fileName: file?.fileName,
        filePath: file?.filePath,
      })),
      hint,
    }).save();

    return res.status(200).json({
      message: "Email sent successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to send email",
      success: false,
      error: error.message,
    });
  }
});

module.exports.getMySentMail = asyncErrorCatcher(async (req, res) => {
  const userId = await req?.user?.id;
  const { take = 10, skip = 0, search } = await req?.query;
  const mails = await Mail.find({
    $and: [
      { user: userId },
      {
        $or: [
          { to: { $regex: search || "", $options: "i" } },
          { subject: { $regex: search || "", $options: "i" } },
          { body: { $regex: search || "", $options: "i" } },
          { hint: { $regex: search || "", $options: "i" } },
        ],
      },
    ],
  })
    .sort({ createdAt: -1 })
    .skip(Number(skip))
    .limit(Number(take));

  if (!mails || mails.length === 0) {
    return res.status(404).json({
      message: "No sent emails found",
      success: false,
    });
  }

  return res.status(200).json({
    message: "Sent emails retrieved successfully",
    success: true,
    data: mails,
  });
});

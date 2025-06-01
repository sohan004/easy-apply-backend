const { default: mongoose } = require("mongoose");
const asyncErrorCatcher = require("../middleware/asyncErrorCatcher");
const { Template, Attachment } = require("../model");
const fileUpload = require("../utilities/fileUpload");

module.exports.createTemplate = asyncErrorCatcher(async (req, res) => {
  const files = (await req?.files) || [];
  const { _id, templateName, subject, body, deleteAttachmentId } =
    await JSON.parse((await req?.body?.data) || "{}");
  let templateId = _id || null;
  const user = await req.user.id;

  if (!templateName || !subject || !body) {
    return res.status(400).json({
      message: "Template name, subject, and body are required",
      success: false,
    });
  }

  if (!_id) {
    const newTemplate = new Template({
      user,
      templateName,
      subject,
      body,
    }).save();
    templateId = await newTemplate._id;
  }

  if (_id) {
    await Template.findByIdAndUpdate(_id, {
      templateName,
      subject,
      body,
    });
  }

  if (files.length > 0) {
    await Attachment.insertMany(
      files.map((file) => ({
        user,
        fileName: file.fileName,
        fileSize: file.fileSize,
        fileType: file.fileType,
        filePath: file.filePath,
        template: templateId,
      }))
    );
  }

  if (deleteAttachmentId) {
    const objectId = await Promise.all(
      deleteAttachmentId.map((id) => new mongoose.Types.ObjectId(id))
    );
    await Attachment.deleteMany({ _id: { $in: objectId } });
  }

  res.json({
    message: _id
      ? "Template updated successfully"
      : "Template created successfully",
    success: true,
    templateId,
  });
});

module.exports.getTemplates = asyncErrorCatcher(async (req, res) => {
  const userId = await req.user.id;
  const findTemplates = await Template.aggregate([
    {
      $match: { user: new mongoose.Types.ObjectId(userId) },
    },
    {
      $lookup: {
        from: "attachments",
        localField: "_id",
        foreignField: "template",
        as: "attachments",
      },
    },
    {
      $project: {
        _id: 1,
        templateName: 1,
        subject: 1,
        body: 1,
        attachments: 1,
      },
    },
  ]);

  res.json({
    message: "Templates fetched successfully",
    success: true,
    templates: findTemplates,
  });
});

module.exports.deleteTemplate = asyncErrorCatcher(async (req, res) => {
  const { id } = await req.params;
  const userId = await req.user.id;
  const template = await Template.findOneAndDelete({
    _id: id,
    user: userId,
  });

  res.json({
    message: "Template deleted successfully",
    success: true,
  });
});

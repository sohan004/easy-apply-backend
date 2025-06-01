const fileUpload = require("../utilities/fileUpload");

const fileUploadMiddleware = async (req, res, next) => {
  try {
    const files = await req?.files?.file;
    const arrayFiles = files ? (Array.isArray(files) ? files : [files]) : [];

    if (arrayFiles.length === 0) {
      return next();
    }

    const uploadedFile = await Promise.all(arrayFiles.map(fileUpload));

    req.files = uploadedFile;
    return next();
  } catch (error) {
    console.error("File upload error:", error);
    return res.status(500).json({
      message: "File upload failed",
      success: false,
      error: error.message || "An error occurred during file upload",
    });
  }
};

module.exports = fileUploadMiddleware;

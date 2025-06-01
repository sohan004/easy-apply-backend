const fs = require("fs");
const path = require("path");

const fileUpload = (file) => {
  return new Promise((resolve, reject) => {
    try {
      const folderPath = path.resolve(__dirname, "../media");

      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      const uniqRandomNumber = Math.floor(Math.random() * 1e10);
      const currentDate = Date.now();

      const originalFileName = file.name || "unknown";
      const sanitizedFileName = originalFileName
        .replace(/\s+/g, "-")
        .replace(/[?&]/g, "-");

      const newFileName = `${uniqRandomNumber}-${currentDate}-${sanitizedFileName}`;
      const filePath = path.join(folderPath, newFileName);

      file.mv(filePath, (err) => {
        if (err) return reject(err);

        resolve({
          fileName: originalFileName,
          fileSize: file.size,
          fileType: file.mimetype,
          filePath: newFileName,
        });
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = fileUpload;

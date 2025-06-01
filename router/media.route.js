const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const mime = require("mime-types");
const asyncErrorCatcher = require("../middleware/asyncErrorCatcher");

router.get(
  "/:name",
  asyncErrorCatcher(async (req, res) => {
    const { name } = await req.params;
    const rootDir = await path.join(__dirname, "../media");
    const filePath = await path.join(rootDir, name);
    if (await !fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }
    const mimeType = mime.lookup(filePath);
    res.setHeader("Content-Type", mimeType);
    const stream = await fs.createReadStream(filePath);
    await stream.pipe(res);
  })
);

module.exports = router;

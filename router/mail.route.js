const router = require("express").Router();
const { getMySentMail, sendMail } = require("../controller/mail.controller.js");
const authMiddleware = require("../middleware/authMIddleware.js");
const fileUploadMiddleware = require("../middleware/fileUploadMiddleware.js");

router.post("/send", authMiddleware, fileUploadMiddleware, sendMail);
router.get("/", authMiddleware, getMySentMail);

module.exports = router;

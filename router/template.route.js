const router = require("express").Router();
const {
  createTemplate,
  deleteTemplate,
  getTemplates,
} = require("../controller/template.controller.js");
const authMiddleware = require("../middleware/authMIddleware.js");
const fileUploadMiddleware = require("../middleware/fileUploadMiddleware.js");

router.post(
  "/createAndUpdate",
  authMiddleware,
  fileUploadMiddleware,
  createTemplate
);
router.delete("/:id", authMiddleware, deleteTemplate);
router.get("/", authMiddleware, getTemplates);

module.exports = router;

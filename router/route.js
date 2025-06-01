const router = require("express").Router();

router.use("/auth", require("./auth.route"));
router.use("/mail", require("./mail.route"));
router.use("/template", require("./template.route"));
router.use("/media", require("./media.route"));


module.exports = router;

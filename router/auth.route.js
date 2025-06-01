const {
  signup,
  login,
  logout,
  refreshToken,
  sendOtp,
  verifyOtp,
  getInfo,
  updateProfile,
  forgotPassword,
  resetPassword,
} = require("../controller/auth.controller");
const authMiddleware = require("../middleware/authMIddleware");

const router = require("express").Router();

// route for /auth
router.post("/signup", signup);
router.post("/login", login);
router.put("/logout", authMiddleware, logout);
router.post("/refresh-access-token", refreshToken);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.get("/info", authMiddleware, getInfo);
router.put("/info", authMiddleware, updateProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;

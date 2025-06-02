const forgetPassMail = require("../emailTemplate/forgetPassMail");
const otpMail = require("../emailTemplate/otpMail");
const asyncErrorCatcher = require("../middleware/asyncErrorCatcher");
const { User, Otp, ForgotPassToken, Template, Mail } = require("../model");
const getFileFullUrl = require("../router/getFileFullUrl");
const { setCookie, getCookie, clearCookie } = require("../utilities/cookie");
const {
  generateNewJsonToken,
  verifyToken,
} = require("../utilities/generateNewJsonToken");
const {
  getHashPassword,
  comparePassword,
} = require("../utilities/genHashPassword");
const getOtp = require("../utilities/getOtp");

module.exports.signup = asyncErrorCatcher(async (req, res) => {
  const { name, email, password, phone, emailAppPass } = await req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }
  const hashedPassword = await getHashPassword(password);
  const user = await new User({
    name,
    email,
    password: hashedPassword,
    phone,
    emailAppPass,
  }).save();
  res.json({ message: "User registered", success: true });
});

module.exports.sendOtp = asyncErrorCatcher(async (req, res) => {
  const { email } = await req.body;
  const newOtp = getOtp();
  await new Otp({ email, otp: newOtp }).save();
  await otpMail(email, newOtp);
  res.json({ message: "OTP sent", success: true });
});

module.exports.verifyOtp = asyncErrorCatcher(async (req, res) => {
  const { email, otp } = await req.body;
  const otpData = await Otp.findOne({ email, otp });
  if (!otpData) {
    return res.status(400).json({ message: "Invalid OTP" });
  }
  await Otp.deleteOne({ email, otp });
  res.json({ message: "OTP verified", success: true });
});

module.exports.login = asyncErrorCatcher(async (req, res) => {
  const { email, password } = await req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const accessToken = generateNewJsonToken(user._id, "15m");
  const refreshToken = generateNewJsonToken(user._id, "30d");

  user.refreshToken = refreshToken;
  await user.save();

  setCookie(res, "refreshToken", refreshToken, 7 * 24 * 60 * 60 * 1000);

  res.json({
    accessToken,
    message: "Login successful",
    data: {
      name: user.name,
      email: user.email,
    },
    success: true,
  });
});

module.exports.logout = asyncErrorCatcher(async (req, res) => {
  const refreshToken = await getCookie(req, "refreshToken");
  if (!refreshToken) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const user = await User.findOne({ refreshToken });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  user.refreshToken = "";
  await user.save();

  clearCookie(res, "refreshToken");

  res.json({ message: "Logout successful", success: true });
});

module.exports.refreshToken = asyncErrorCatcher(async (req, res) => {
  const refreshToken = await req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const user = await User.findOne({ refreshToken });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isValidRefreshToken = await verifyToken(refreshToken);
  if (!isValidRefreshToken) {
    return res.status(400).json({ message: "Invalid token" });
  }

  const accessToken = generateNewJsonToken(user._id, "15m");
  const newRefreshToken = generateNewJsonToken(user._id, "30d");

  user.refreshToken = newRefreshToken;
  await user.save();

  setCookie(res, "refreshToken", newRefreshToken, 7 * 24 * 60 * 60 * 1000);

  res.json({
    accessToken,
    message: "Token refreshed",
    success: true,
  });
});

module.exports.getInfo = asyncErrorCatcher(async (req, res) => {
  const id = await req.user.id;
  let user = await User.findById(id).select("-password -refreshToken");
  const totalTemplate = await Template.countDocuments({ user: id });
  const totalMailSubmitted = await Mail.countDocuments({ user: id });
  const userFullProfilePicture = await getFileFullUrl(
    req,
    user?.profilePicture
  );

  const data = {
    ...user?.toObject(),
    profilePicture: userFullProfilePicture,
    totalTemplate,
    totalMailSubmitted,
  };

  res.json({ user: data, success: true });
});

module.exports.updateProfile = asyncErrorCatcher(async (req, res) => {
  const file = (await req?.files?.length) > 0 ? req?.files[0] : null;
  const { name, password, phone, emailAppPass, address } = await req.body;
  const id = await req.user.id;
  let updateData = {};
  if (name) updateData["name"] = name;
  if (phone) updateData["phone"] = phone;
  if (emailAppPass) updateData["emailAppPass"] = emailAppPass;
  if (address) updateData["address"] = address;
  if (password) {
    const hashedPassword = await getHashPassword(password);
    updateData["password"] = hashedPassword;
  }
  if (file) {
    updateData["profilePicture"] = file.filePath;
  }

  const updateUser = await User.findByIdAndUpdate(id, updateData);

  res.json({
    message: "Profile updated successfully",
    success: true,
  });
});

module.exports.forgotPassword = asyncErrorCatcher(async (req, res) => {
  const { email } = await req.body;
  const origin = (await req.headers["origin"]) || (await req.headers["Origin"]);
  const token = await new ForgotPassToken({
    email,
  }).save();

  await forgetPassMail(email, token._id, origin);
  res.json({
    message: "Password reset link sent to your email",
    success: true,
  });
});

module.exports.resetPassword = asyncErrorCatcher(async (req, res) => {
  const { token, newPassword } = await req.body;
  const forgotPassToken = await ForgotPassToken.findById(token);
  if (!forgotPassToken) {
    return res.status(400).json({ message: "Invalid token" });
  }

  const user = await User.findOne({ email: forgotPassToken.email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  user.password = await getHashPassword(newPassword);
  await user.save();

  res.json({
    message: "Password reset successfully",
    success: true,
  });
});

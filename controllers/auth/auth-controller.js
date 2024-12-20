const bycript = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
require("dotenv").config();

// AUTH CONTROLLERS (middleware)
// register
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const checkEmail = await User.findOne({ email: email });
    if (checkEmail)
      return res
        .status(200)
        .json({ message: "User with this email already exists" });

    const hashPassowrd = await bycript.hash(password, 12);
    const newUser = new User({
      userName,
      email,
      password: hashPassowrd,
    });

    await newUser.save();
    res.status(200);
    res.json({
      success: true,
      message: "User has been registered successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    // check email
    if (!checkUser)
      return res.json({
        message: "User with this email is not found",
        success: false,
      });

    // check password
    const checkPassword = await bycript.compare(password, checkUser.password);
    if (!checkPassword)
      return res.json({
        message: "Password is incorrect",
        success: false,
      });

    // create jwt token
    const token = jwt.sign(
      {
        id: checkUser._id,
        email: checkUser.email,
        role: checkUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "60m" }
    );

    // save token as a cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
    });

    // send final response
    res.json({
      message: "User has been logged in successfully",
      success: true,
      user: {
        id: checkUser._id,
        email: checkUser.email,
        role: checkUser.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// logout
const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User has been logged out successfully",
    success: true,
  });
};

// auth middleware
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({ message: "Unauthorized", success: false });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Unauthorized", success: false });
  }
};

module.exports = { registerUser, loginUser, logoutUser, authMiddleware };

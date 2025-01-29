require("dotenv").config();
const bycript = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const CryptoJS = require("crypto-js");

const DATA_ENCRYPTION_KEY = process.env.DATA_ENCRYPTION_KEY;

// AUTH CONTROLLERS (middleware)
// register
const registerUser = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
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
      role: "user",
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
  try {
    const { email, password } = req.body;

    // Decrypt the email and password
    const decryptedEmail = CryptoJS.AES.decrypt(
      email,
      DATA_ENCRYPTION_KEY
    ).toString(CryptoJS.enc.Utf8);
    const decryptedPassword = CryptoJS.AES.decrypt(
      password,
      DATA_ENCRYPTION_KEY
    ).toString(CryptoJS.enc.Utf8);

    const checkUser = await User.findOne({ email: decryptedEmail });
    // check email
    if (!checkUser)
      return res.json({
        message: "User with this email is not found",
        success: false,
      });

    // check password
    const checkPassword = await bycript.compare(
      decryptedPassword,
      checkUser.password
    );
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
        userName: checkUser.userName,
      },
      process.env.JWT_SECRET,
      { expiresIn: "60m" }
    );

    // add token cookie in server response, so that client's browser can store it in cookie
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: false,
    // });

    // send final response {jwt token included in cookie server response}
    res.json({
      message: "User has been logged in successfully",
      success: true,
      token,
      user: {
        id: checkUser._id,
        email: checkUser.email,
        role: checkUser.role,
        userName: checkUser.userName,
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
// const authMiddleware = async (req, res, next) => {
//   try {
//     // check if token is present in cookie
//     // get token from cookie on request
//     const token = req.cookies.token;
//     if (!token)
//       return res.status(401).json({ message: "Unauthorized", success: false });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal Server Error", success: false });
//   }
// };

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token)
      return res.status(401).json({ message: "Unauthorized", success: false });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

module.exports = { registerUser, loginUser, logoutUser, authMiddleware };

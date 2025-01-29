require("dotenv").config();
const UserModel = require("../../models/User");
const bycript = require("bcryptjs");
const CryptoJS = require("crypto-js");

const DATA_ENCRYPTION_KEY = process.env.DATA_ENCRYPTION_KEY;

const updateProfile = async (req, res) => {
  try {
    const { userName, email, password, userId } = req.body;
    // const userId = req.user.id;

    if (!userName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    // check password is correct
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const checkPassword = await bycript.compare(password, user.password);
    if (!checkPassword) {
      return res.status(400).json({
        success: false,
        just: true,
        message: "Password is incorrect",
        more: "hehe",
      });
    }

    if (email !== user.email) {
      const existedEmail = await UserModel.find({ email: email });
      if (existedEmail.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Email is already taken",
        });
      }
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      {
        _id: userId,
      },
      {
        userName,
        email,
      },
      {
        new: true, // this line is to return the updated data
      }
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.log("(account-controller.js) updateProfile Error: ", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { newPassword, oldPassword, userId } = req.body;
    // const userId = req.user.id;

    const decryptedOldPassword = CryptoJS.AES.decrypt(
      oldPassword,
      DATA_ENCRYPTION_KEY
    ).toString(CryptoJS.enc.Utf8);
    const decryptedNewPassword = CryptoJS.AES.decrypt(
      newPassword,
      DATA_ENCRYPTION_KEY
    ).toString(CryptoJS.enc.Utf8);

    if (!newPassword || !oldPassword) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // check if old password is correct
    const checkPassword = await bycript.compare(
      decryptedOldPassword,
      user.password
    );
    if (!checkPassword) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    const newHashedPassword = await bycript.hash(decryptedNewPassword, 12);

    user.password = newHashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log("(account-controller.js) changePassword Error: ", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = { updateProfile, changePassword };

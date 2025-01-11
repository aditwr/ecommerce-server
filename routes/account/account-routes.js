const express = require("express");
const {
  updateProfile,
  changePassword,
} = require("../../controllers/account/account-controller");

const router = express.Router();
// prefix - /api/account
router.put("/update-profile", updateProfile);
router.put("/change-password", changePassword);

module.exports = router;

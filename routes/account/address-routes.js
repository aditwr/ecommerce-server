const express = require("express");
const {
  createAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
} = require("../../controllers/account/address-controller");

const router = express.Router();

// prefix - /account/address
router.post("/add/", createAddress);
router.get("/get", getAddresses);
router.delete("/delete/:addressId", deleteAddress);

module.exports = router;

const express = require("express");
const {
  createAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
} = require("../../controllers/account/address-controller");

const router = express.Router();

router.post("/add/", createAddress);
router.get("/get", getAddresses);
// router.put("/update/:userId/:addressId", updateAddress);
router.delete("/delete/:addressId", deleteAddress);

module.exports = router;

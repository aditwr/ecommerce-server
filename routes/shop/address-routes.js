const express = require("express");
const {
  createAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
} = require("../../controllers/shop/address-controller");

const router = express.Router();

router.post("/create/:userId", createAddress);
router.get("/:userId", getAddresses);
router.put("/update/:userId/:addressId", updateAddress);
router.delete("/delete/:userId/:addressId", deleteAddress);

module.exports = router;

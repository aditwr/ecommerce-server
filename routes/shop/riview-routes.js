const express = require("express");
const router = express.Router();
const {
  createRiview,
  checkIsUserBroughtProduct,
  checkIsUserAlreadyRiviewed,
  fetchRiviews,
} = require("../../controllers/shop/riview-controller");

// prefix - /api/shop/riview
router.get("/:productId", fetchRiviews);
router.post("/create", createRiview);
router.post("/check/brought-product", checkIsUserBroughtProduct);
router.post("/check/has-riviewed", checkIsUserAlreadyRiviewed);

module.exports = router;

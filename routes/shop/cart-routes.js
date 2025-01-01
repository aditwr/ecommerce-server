const express = require("express");
const {
  addProductToCart,
  getCartOfSpecificUser,
  increaseCartProductQuantity,
  decreaseCartProductQuantity,
  removeProductFromCart,
} = require("../../controllers/shop/cart-controller");

const router = express.Router();
// Prefix : /api/shop/cart
router.post("/add", addProductToCart);
router.get("/:userId", getCartOfSpecificUser);
router.post("/increase", increaseCartProductQuantity);

module.exports = router;

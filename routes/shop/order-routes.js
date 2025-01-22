const express = require("express");
const {
  createOrder,
  capturePayment,
  getOrdersByUserId,
} = require("../../controllers/shop/order-controller");

const router = express.Router();
// prefix - /api/shop/order
router.post("/create", createOrder);
router.post("/capture-payment", capturePayment);
router.get("/:userId/get", getOrdersByUserId);

module.exports = router;

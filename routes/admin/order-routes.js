const express = require("express");
const router = express.Router();
const {
  fetchAllOrders,
  updateOrderStatus,
} = require("../../controllers/admin/order-controller");

// prefix - /admin/order
router.get("/get", fetchAllOrders);
router.put("/update/:orderId", updateOrderStatus);

module.exports = router;

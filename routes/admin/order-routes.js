const express = require("express");
const router = express.Router();
const { fetchAllOrders } = require("../../controllers/admin/order-controller");

router.get("/get", fetchAllOrders);

module.exports = router;

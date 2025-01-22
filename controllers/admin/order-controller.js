const OrderModel = require("../../models/Order");

async function fetchAllOrders(req, res) {
  try {
    const { page, limit, sort } = req.query;

    let filters = {};
    if (sort === "newest") {
      filters.orderDate = -1;
    } else if (sort === "oldest") {
      filters.orderDate = 1;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const orders = await OrderModel.find()
      .skip(skip)
      .limit(limit)
      .sort(filters)
      .populate("user", "email userName");

    const countDocuments = await OrderModel.countDocuments();
    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
      countDocuments,
    });
  } catch (error) {
    console.log("Error in fetchAllOrders", error);
    res.status(500).json({ message: "Internal server error", succeess: false });
  }
}

module.exports = {
  fetchAllOrders,
};

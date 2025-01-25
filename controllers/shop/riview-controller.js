const RiviewModel = require("../../models/Riview");
const OrderModel = require("../../models/Order");
const ProductModel = require("../../models/Product");

const fetchRiviews = async (req, res) => {
  try {
    const productId = req.params.productId;
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "ProductId is required",
      });
    }

    const isProductIdValid = await ProductModel.findById(productId);
    if (!isProductIdValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid ProductId",
      });
    }

    const riviews = await RiviewModel.find({ product: productId })
      .populate("user", "email userName")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Riviews for this product is fetched successfully!",
      riviews,
    });
  } catch (error) {
    console.log("Error in fetchRiviews", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const createRiview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id;
    if (!productId || !userId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "ProductId, UserId, Rating and Comment is required",
      });
    }

    //   cek if user already brought the product
    const isUserBroughtProduct = await OrderModel.findOne({
      user: userId,
      products: { $elemMatch: { productId: productId } },
    });
    if (!isUserBroughtProduct) {
      return res.status(400).json({
        success: false,
        message: "You have to buy the product to review it",
      });
    }

    //   cek if user already review the product
    const isUserAlreadyRiviewTheProduct = await RiviewModel.findOne({
      product: productId,
      user: userId,
    });
    if (isUserAlreadyRiviewTheProduct) {
      await RiviewModel.findOneAndUpdate(
        {
          product: productId,
          user: userId,
        },
        {
          rating,
          comment,
        }
      );
      return res.status(200).json({
        success: true,
        message: "Riview updated successfully",
      });
    }

    const newRiview = new RiviewModel({
      product: productId,
      user: userId,
      rating,
      comment,
    });

    await newRiview.save();

    return res
      .status(201)
      .json({ success: true, message: "Riview created successfully" });
  } catch (error) {
    console.log("Error in createRiview", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const checkIsUserBroughtProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;
    if (!productId || !userId) {
      return res.status(400).json({
        success: false,
        message: "ProductId and UserId is required",
      });
    }

    const isUserBroughtProduct = await OrderModel.findOne({
      user: userId,
      products: { $elemMatch: { productId: productId } },
    });

    if (isUserBroughtProduct) {
      return res.status(200).json({
        success: true,
        message: "User already brought the product",
        data: { isUserBroughtTheProduct: true },
      });
    }

    return res.status(200).json({
      success: true,
      message: "User not brought the product",
      data: { isUserBroughtTheProduct: false },
    });
  } catch (error) {
    console.log("Error in checkIsUserBroughtProduct", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const checkIsUserAlreadyRiviewed = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;
    if (!productId || !userId) {
      return res.status(400).json({
        success: false,
        message: "ProductId and UserId is required",
      });
    }

    const isUserAlreadyRiviewed = await RiviewModel.findOne({
      product: productId,
      user: userId,
    });

    if (isUserAlreadyRiviewed) {
      return res.status(200).json({
        success: true,
        message: "User already review the product",
        data: { isUserAlreadyRiviewed: true, riview: isUserAlreadyRiviewed },
      });
    }

    return res.status(200).json({
      success: true,
      message: "User not review the product",
      data: { isUserAlreadyRiviewed: false },
    });
  } catch (error) {
    console.log("Error in checkIsUserAlreadyRiviewed", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  fetchRiviews,
  createRiview,
  checkIsUserBroughtProduct,
  checkIsUserAlreadyRiviewed,
};

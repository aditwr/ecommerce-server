const { ImageUploadUtil } = require("../../helpers/cloudinary");
const ProductModel = require("../../models/Product");

const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = `data:${req.file.mimetype};base64,${b64}`;
    const result = await ImageUploadUtil(url);

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// add a new products
// route : [POST] (domain)/api/admin/products/add
const addProduct = async (req, res) => {
  try {
    const formData = req.body;
    const newlyCreatedProduct = new ProductModel({
      ...formData,
    });

    const savedProduct = await newlyCreatedProduct.save();
    res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: savedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// fetch all products\
// route : [GET] (domain)/api/admin/products/get
const fetchAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const listOfProducts = await ProductModel.find({}).skip(skip).limit(limit);
    const countDocuments = await ProductModel.countDocuments({});
    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: listOfProducts,
      totalDocuments: countDocuments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// edit a product
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const formData = req.body;

    const findProduct = await ProductModel.findById(id);
    if (!findProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    findProduct.image = formData.image || findProduct.image;
    findProduct.title = formData.title || findProduct.title;
    findProduct.description = formData.description || findProduct.description;
    findProduct.category = formData.category || findProduct.category;
    findProduct.brand = formData.brand || findProduct.brand;
    findProduct.price = formData.price || findProduct.price;
    findProduct.salePrice =
      formData.salePrice === ""
        ? null
        : formData.salePrice || findProduct.salePrice;
    findProduct.totalStock = formData.totalStock || findProduct.totalStock;

    const updatedProduct = await findProduct.save();
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await ProductModel.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error: error });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
};

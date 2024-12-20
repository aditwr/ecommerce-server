const express = require("express");
const {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
} = require("../../controllers/admin/product-controller");
const { upload } = require("../../helpers/cloudinary");

const router = express.Router();

// Route to upload a product image
router.post("/upload-image", upload.single("my_file"), handleImageUpload);
// routes
router.get("/get", fetchAllProducts);
router.post("/add", addProduct);
router.put("/edit/:id", editProduct);
router.delete("/delete/:id", deleteProduct);

module.exports = router;

const ProductModel = require("../../models/Product");

const getFilteredProducts = async (req, res) => {
  try {
    const { category, brand, sort } = req.query;
    let filters = {};
    let sortCriteria = {};
    if (category) filters.category = { $in: category.split(",") };
    if (brand) filters.brand = { $in: brand.split(",") };

    // Determine sort criteria
    switch (sort) {
      case "price-low-to-high":
        sortCriteria.price = 1;
        break;
      case "price-high-to-low":
        sortCriteria.price = -1;
        break;
      case "newest":
        sortCriteria.createdAt = -1;
        break;
      case "oldest":
        sortCriteria.createdAt = 1;
        break;
      case "title-ascending":
        sortCriteria.title = 1;
        break;
      case "title-descending":
        sortCriteria.title = -1;
        break;
      default:
        sortCriteria.createdAt = -1; // default to newest
    }

    const products = await ProductModel.find(filters).sort(sortCriteria);
    res.status(200).json({ products, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message, success: false });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findById(id);

    if (!product)
      res.status(404).json({ message: "Product not found", success: false });

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message, success: false });
  }
};

module.exports = { getFilteredProducts, getProductDetails };

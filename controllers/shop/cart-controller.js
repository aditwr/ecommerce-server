const CartModel = require("../../models/Cart");
const ProductModel = require("../../models/Product");

const addProductToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body; // req.body is sent by post request from client

    if (!userId || !productId || !quantity)
      return res
        .status(400)
        .json({ message: "Invalid data provided", success: false });

    const product = await ProductModel.findById(productId);
    if (!product)
      return res
        .status(404)
        .json({ message: "Product not found", success: false });

    //   find the cart of the specific user
    const userCart = await CartModel.findOne({ userId });

    //   if the cart does not exist, create a new cart
    if (!userCart) {
      const newUserCart = new CartModel({
        userId,
        products: [{ productId, quantity }], // add the first product to array of products
      });
      await newUserCart.save();
    } else {
      //   if the cart exists, check if the product already exists in the cart
      const productIndex = userCart.products.findIndex(
        (product) => product.productId == productId
      );

      //   if the product exists, update the quantity
      if (productIndex !== -1) {
        userCart.products[productIndex].quantity += quantity;
        await userCart.save();
      } else {
        //   if the product does not exist, add the product to the userCart
        userCart.products.push({ productId, quantity });
        await userCart.save();
      }
    }

    res.status(200).json({
      message: "Product added to cart",
      success: true,
      data: userCart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message, success: false });
  }
};

const getCartOfSpecificUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId)
      return res
        .status(400)
        .json({ message: "User id is mandatory!", success: false });

    const userCart = await CartModel.findOne({ userId }).populate(
      "products.productId"
    );

    if (!userCart)
      return res
        .status(404)
        .json({ message: "Cart not found", success: false });

    // check for the product availability / if the product is deleted
    validProducts = userCart.products.filter(
      (product) => product.productId !== null
    );
    if (validProducts.length !== userCart.products.length) {
      userCart.products = validProducts;
      await userCart.save();
    }

    res.status(200).json({
      success: true,
      data: userCart,
      message: "Cart data for user is fetched",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message, success: false });
  }
};

const increaseCartProductQuantity = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body; // send by post req method

    if (!userId || !productId || !quantity)
      return res
        .status(400)
        .json({ message: "Invalid data provided", success: false });

    const cartOfSpesificUser = await CartModel.findOne({ userId });

    if (!cartOfSpesificUser)
      return res
        .status(404)
        .json({ message: "User shopping cart data not found", success: false });

    const productIndex = cartOfSpesificUser.products.findIndex(
      (product) => product.productId === productId
    );

    if (productIndex === -1)
      return res
        .status(404)
        .json({
          message: "Product not found in user shopping cart",
          success: false,
        });

    cartOfSpesificUser.products[productIndex].quantity += quantity;
    await cartOfSpesificUser.save();

    res.status(200).json({ success: true, data: cartOfSpesificUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message, success: false });
  }
};

const decreaseCartProductQuantity = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body; // send by post req method

    if (!userId || !productId || !quantity)
      return res
        .status(400)
        .json({ message: "Invalid data provided", success: false });

    const cartOfSpesificUser = await CartModel.findOne({ userId });

    if (!cartOfSpesificUser)
      return res
        .status(404)
        .json({ message: "Cart not found", success: false });

    const productIndex = cartOfSpesificUser.products.findIndex(
      (product) => product.productId === productId
    );

    if (productIndex === -1)
      return res
        .status(404)
        .json({ message: "Product not found in cart", success: false });

    if (cartOfSpesificUser.products[productIndex].quantity - quantity <= 0) {
      cartOfSpesificUser.products = cartOfSpesificUser.products.filter(
        (product) => product.productId !== productId
      );
    } else {
      cartOfSpesificUser.products[productIndex].quantity -= quantity;
    }

    await cartOfSpesificUser.save();

    res.status(200).json({ success: true, data: cartOfSpesificUser });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const removeProductFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body; // send by post req method

    if (!userId || !productId)
      return res
        .status(400)
        .json({ message: "Invalid data provided", success: false });

    const cartOfSpesificUser = await CartModel.findOne({ userId });

    if (!cartOfSpesificUser)
      return res
        .status(404)
        .json({ message: "Cart not found", success: false });

    cartOfSpesificUser.products = cartOfSpesificUser.products.filter(
      (product) => product.productId !== productId
    );

    await cartOfSpesificUser.save();

    res.status(200).json({ success: true, data: cartOfSpesificUser });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

module.exports = {
  addProductToCart,
  getCartOfSpecificUser,
  increaseCartProductQuantity,
  decreaseCartProductQuantity,
  removeProductFromCart,
};

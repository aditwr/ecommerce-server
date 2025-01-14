const AddressModel = require("../../models/Address");
const UserModel = require("../../models/User");

const createAddress = async (req, res) => {
  try {
    const {
      address,
      city,
      postalCode,
      country,
      phoneNumber,
      deliveryInstructions,
    } = req.body;
    const userId = req.user.id;

    if (!address || !city || !postalCode || !country || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    const userExists = await UserModel.findById(userId);
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const countAddressesOwnedByUser = await AddressModel.countDocuments({
      user: userId,
    });
    if (countAddressesOwnedByUser >= 5) {
      return res.status(400).json({
        success: false,
        message: "You can only have up to 5 addresses.",
      });
    }

    const newAddress = new AddressModel({
      user: userId,
      address,
      city,
      postalCode,
      country,
      phoneNumber,
      deliveryInstructions,
    });
    await newAddress.save();

    res.status(201).json({
      success: true,
      message: "Address created successfully.",
    });
  } catch (error) {
    console.log("(address-controller) createAddress error: ", error.message);
    res
      .status(500)
      .json({ message: error.message, success: false, error: error });
  }
};

const getAddresses = async (req, res) => {
  try {
    const userId = req.user.id;

    const userExists = await UserModel.findById(userId);
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const addresses = await AddressModel.find({ user: userId });
    res.status(200).json({
      success: true,
      message: "Addresses retrieved successfully.",
      data: addresses,
    });
  } catch (error) {
    console.log("(address-controller) getAddresses error: ", error.message);
    res
      .status(500)
      .json({ message: error.message, success: false, error: error });
  }
};

const updateAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const {
      address,
      city,
      postalCode,
      country,
      phoneNumber,
      deliveryInstructions,
    } = req.body;

    if (!address || !city || !postalCode || !country || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
        data: null,
      });
    }

    //   check if the user is the owner of the address
    const addressOwnedByUser = await AddressModel.findOne({
      _id: addressId,
      user: userId,
    });
    if (!addressOwnedByUser) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
        data: null,
      });
    }

    await AddressModel.findByIdAndUpdate(addressId, {
      address,
      city,
      postalCode,
      country,
      phoneNumber,
      deliveryInstructions,
    });

    res.status(200).json({
      success: true,
      message: "Address updated successfully.",
      data: null,
    });
  } catch (error) {
    console.log("(address-controller) updateAddress error: ", error.message);
    res
      .status(500)
      .json({ message: error.message, success: false, error: error });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const userId = req.user.id;

    //   check if the user is the owner of the address
    const addressOwnedByUser = await AddressModel.findOne({
      _id: addressId,
      user: userId,
    });
    if (!addressOwnedByUser) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    await AddressModel.findByIdAndDelete(addressId);

    res.status(200).json({
      success: true,
      message: "Address deleted successfully.",
    });
  } catch (error) {
    console.log("(address-controller) deleteAddress error: ", error.message);
    res.status(500).json({ message: error.message, success: false });
  }
};

module.exports = { createAddress, getAddresses, updateAddress, deleteAddress };

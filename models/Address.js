const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  deliveryInstructions: {
    // Optional : User can provide delivery instructions like "Call me before delivery"
    type: String,
    required: false,
  },
});

const Address = mongoose.model("Address", AddressSchema);

module.exports = Address;

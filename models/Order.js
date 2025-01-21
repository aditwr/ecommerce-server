const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  products: [
    {
      productId: { type: String, required: true },
      title: { type: String, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  cart: {
    type: Schema.Types.ObjectId,
    ref: "Cart",
    required: true,
  },
  address: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    deliveryInstructions: { type: String, required: false },
  },
  orderStatus: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  orderDate: { type: Date, required: true },
  orderUpdateDate: { type: Date, required: true },
  paymentId: { type: String, required: true },
  payerId: { type: String, required: true },
});

const OrderModel = mongoose.model("Order", orderSchema);

module.exports = OrderModel;

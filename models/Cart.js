const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema(
  {
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, default: 1, min: 1, required: true },
      },
    ],
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);
// {
//   products: [
//     {
//       productId: "1234567890",
//       quantity: 1,
//     },
//     {
//       productId: "0987654321",
//       quantity: 2,
//     }
//   ];
//   userId: "0987654321";
// }
const CartModel = mongoose.model("Cart", cartSchema);

module.exports = CartModel;

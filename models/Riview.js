const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const riviewSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
});

const RiviewModel = mongoose.model("Riview", riviewSchema);

module.exports = RiviewModel;

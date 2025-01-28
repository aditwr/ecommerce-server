const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth/auth-routes");
const adminProductRouter = require("./routes/admin/products-routes");
const shopProductRouter = require("./routes/shop/products-routes");
const cartRouter = require("./routes/shop/cart-routes");
const accountRouter = require("./routes/account/account-routes");
const addressRouter = require("./routes/account/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const adminOrderRouter = require("./routes/admin/order-routes");
const riviewRouter = require("./routes/shop/riview-routes");
const { authMiddleware } = require("./controllers/auth/auth-controller");
require("dotenv").config();

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qn6lu.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB :", err));

const app = express();
// const port = proccess.env.PORT || 3000;

// const corsOptions = {
//   origin: process.env.CLIENT_BASE_URL,
//   mehtods: "GET, POST, PUT, DELETE",
//   allowedHeaders: "Content-Type, Authorization, Cache-Control, EXpires, Pragma",
//   credentials: true,
// };
// app.use(cors(corsOptions)); // to allow cross origin requests
app.use(cookieParser()); // to parse cookies so that we can access them in the request object
app.use(express.json()); // to parse json data in the request body
app.use(express.urlencoded({ extended: true })); // to parse url encoded data in the request body

// middleware

// routes
app.get("/", (req, res) => {
  res.send("The Ecommerce API is running....");
});
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductRouter);
app.use("/api/shop/products", shopProductRouter);
app.use("/api/shop/cart", cartRouter);
app.use("/api/account", authMiddleware, accountRouter);
app.use("/api/account/address", authMiddleware, addressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/admin/order", adminOrderRouter);
app.use("/api/shop/riview", authMiddleware, riviewRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on PORT ${process.env.PORT}`);
});

module.exports = app;

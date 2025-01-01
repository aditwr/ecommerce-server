const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth/auth-routes");
const adminProductRouter = require("./routes/admin/products-routes");
const shopProductRouter = require("./routes/shop/products-routes");
const cartRouter = require("./routes/shop/cart-routes");
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

const corsOptions = {
  origin: "http://localhost:5173",
  mehtods: "GET, POST, PUT, DELETE",
  allowedHeaders: "Content-Type, Authorization, Cache-Control, EXpires, Pragma",
  credentials: true,
};
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// middleware

// routes
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductRouter);
app.use("/api/shop/products", shopProductRouter);
app.use("/api/shop/cart", cartRouter);

app.listen(5000, () => {
  console.log("Server is running on port " + 5000);
});

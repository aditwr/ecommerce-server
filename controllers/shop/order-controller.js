require("dotenv").config();
const paypal = require("../../helpers/paypal");
const OrderModel = require("../../models/Order");
const CartModel = require("../../models/Cart");
const { get } = require("mongoose");

const createOrder = async (req, res) => {
  try {
    const {
      user,
      products,
      address,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      subTotal,
      shippingPrice,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
      cart, // cart id
    } = req.body;

    // create payment json object required for paypal
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      transactions: [
        {
          amount: {
            total: "30.11",
            currency: "USD",
            details: {
              subtotal: "30.00",
              tax: "0.07",
              shipping: "0.03",
              handling_fee: "1.00",
              shipping_discount: "-1.00",
              insurance: "0.01",
            },
          },
          description: "The payment transaction description.",
          invoice_number: "48787589673",
          payment_options: {
            allowed_payment_method: "INSTANT_FUNDING_SOURCE",
          },
          custom: "This is a test transaction",
          soft_descriptor: "ECHI5786786",
          item_list: {
            items: [
              {
                name: "hat",
                description: "Brown hat.",
                quantity: "5",
                price: "3",
                tax: "0.01",
                sku: "1",
                currency: "USD",
              },
              {
                name: "handbag",
                description: "Black handbag.",
                quantity: "1",
                price: "15",
                tax: "0.02",
                sku: "product34",
                currency: "USD",
              },
            ],
            shipping_address: {
              recipient_name: "Brian Robinson",
              line1: "4th Floor",
              line2: "Unit #34",
              city: "San Jose",
              country_code: "US",
              postal_code: "95131",
              phone: "011862212345678",
              state: "CA",
            },
          },
        },
      ],
      note_to_payer: "Contact us for any questions on your order.",
      redirect_urls: {
        return_url: `${
          process.env.CLIENT_BASE_URL || "http://localhost:5173"
        }/shop/paypal-return`,
        cancel_url: `${
          process.env.CLIENT_BASE_URL || "http://localhost:5173"
        }/shop/paypal-cancel`,
      },
    };

    paypal.payment.create(create_payment_json, async function (error, payment) {
      if (error) {
        console.log("Error in paypal createOrder", error);
        return res.status(500).json({
          message: "Error while creating paypal payment",
          success: false,
        });
      } else {
        const newlyCreatedOrder = new OrderModel({
          products,
          user: user.id,
          cart,
          address,
          orderStatus,
          paymentMethod,
          paymentStatus,
          totalAmount,
          orderDate,
          orderUpdateDate,
          paymentId: payment.id,
          payerId: "-", // update this later
        });

        await newlyCreatedOrder.save();

        //   if payment is created successfully then we will get the payment approval url
        const approvalURL = payment.links.find(
          (link) => link.rel === "approval_url"
        ).href;

        res.status(201).json({
          message: "Order created successfully",
          success: true,
          approvalURL,
          orderId: newlyCreatedOrder._id,
        });
      }
    });
  } catch (error) {
    console.log("Error in paypal createOrder", error);
    res
      .status(500)
      .json({ message: "Error while creating an order", succeess: false });
  }
};

async function capturePayment(req, res) {
  try {
    const { paymentId, payerId, orderId } = req.body;
    if (!paymentId || !payerId || !orderId) {
      return res
        .status(400)
        .json({ message: "PaymentId, PayerId and OrderId is required" });
    }

    let order = await OrderModel.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found", success: false });
    }

    order.paymentStatus = "paid";
    order.paymentId = paymentId;
    order.orderStatus = "confirmed";
    order.payerId = payerId;

    const cartID = order.cart;
    await CartModel.findByIdAndDelete(cartID);

    await await order.save();

    return res.status(200).json({
      message: "Payment captured successfully",
      success: true,
    });
  } catch (error) {
    console.log("Error in createOrder", error);
    res.status(500).json({ message: "Internal server error", succeess: false });
  }
}

async function getOrdersByUserId(req, res) {
  try {
    const { userId } = req.params;
    const orders = await OrderModel.find({ user: userId }).populate("user");
    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    console.log("Error in getOrdersByUserId", error);
    res.status(500).json({ message: "Internal server error", succeess: false });
  }
}

module.exports = { createOrder, capturePayment, getOrdersByUserId };

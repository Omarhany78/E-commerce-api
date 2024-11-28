const Order = require("../models/Order");
const Product = require("../models/Product");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { checkPermissions } = require("../utils");

const fakeStripeAPI = async ({ currency, amount }) => {
  const client_secret = "randomClientSecret";
  return { client_secret, amount };
};

const createOrder = async (req, res) => {
  const { tax, shippingFee, items: cartItems } = req.body;

  if (!shippingFee || !tax) {
    throw new CustomError.BadRequestError(
      "Please provide tax and shiiping fee"
    );
  }
  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError("Please provide cart items");
  }

  let orderItems = [];
  let subTotal = 0;

  for (const item of cartItems) {
    const dbProduct = await Product.findById(item.product);

    if (!dbProduct) {
      throw new CustomError.NotFoundError(
        `There is no product with id ${item.product}`
      );
    }

    const { name, price, image, id: product } = dbProduct;
    const singleOrderItem = {
      name,
      image,
      price,
      product,
      amount: item.amount,
    };
    orderItems = [...orderItems, singleOrderItem];
    subTotal += price * item.amount;
  }

  const total = subTotal + shippingFee + tax;
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: "usd",
  });

  const order = await Order.create({
    tax,
    shippingFee,
    subTotal,
    total,
    orderItems,
    user: req.user.userId,
    clientSecret: paymentIntent.client_secret,
  });
  res.status(StatusCodes.CREATED).json({ order });
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find();
  res.status(StatusCodes.OK).json({ count: orders.length, orders });
};

const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const order = await Order.findById(orderId);

  if (!order) {
    throw new CustomError.NotFoundError(`No order with id ${orderId}`);
  }

  checkPermissions(req.user, order.user);
  res.status(StatusCodes.OK).json({ order });
};

const getCurrentUserOrders = async (req, res) => {
  const { userId } = req.user;
  const orders = await Order.find({ user: userId });
  res.status(StatusCodes.OK).json({ count: orders.length, orders });
};

const updateOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const { paymentId } = req.body;
  if (!paymentId) {
    throw new CustomError.NotFoundError(`Please provide payment id`);
  }
  const order = await Order.findById(orderId);

  if (!order) {
    throw new CustomError.NotFoundError(`No order with id ${orderId}`);
  }

  checkPermissions(req.user, order.user);
  await order.updateOne(
    { paymentId, status: "paid" },
    { runValidators: true, new: true }
  );
  await order.save();
  res.status(StatusCodes.OK).json({ order });
};

const deleteAllOrders = async (req, res) => {
  await Order.deleteMany();
  res.status(StatusCodes.OK).json({ msg: "Deleted Successfully" });
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
  deleteAllOrders,
};

const User = require("./models/User");
const Product = require("./models/Product");
const Review = require("./models/Review");
const Order = require("./models/Order");

const deleteEveryThing = async (req, res) => {
  await User.deleteMany();
  await Product.deleteMany();
  await Review.deleteMany();
  await Order.deleteMany();
  res.send("Everything deleted successfully");
};

module.exports = deleteEveryThing;

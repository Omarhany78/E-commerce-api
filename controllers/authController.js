const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const isFirstUser = (await User.countDocuments({})) === 0;
  const role = isFirstUser ? "admin" : "user";
  if (await User.findOne({ email: email }).name) {
    console.log(User.findOne({ email: email }));
    throw new CustomError.BadRequestError("Email is used, Try another one");
  }
  const user = await User.create({ name, email, password, role });
  const tokenUser = await user.attachCookie({ user, res });
  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    throw new CustomError.UnauthenticatedError("Wrong email provided");
  }

  if (!(await user.comparePasswords(password))) {
    throw new CustomError.UnauthenticatedError("Wrong password provided");
  }

  const tokenUser = await user.attachCookie({ user, res });
  res.status(StatusCodes.OK).json({ tokenUser });
};

const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "Logged out successfully" });
};

const deleteAllUsers = async (req, res) => {
  await User.deleteMany();
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "Deleted seccessfully" });
};

module.exports = { register, login, logout, deleteAllUsers };

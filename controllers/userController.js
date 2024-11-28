const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select("-password");
  if (!user) {
    throw new CustomError.NotFoundError(`There is no user with id ${id}`);
  }
  checkPermissions(req.user, id);
  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  const user = req.user;
  console.log(await User.findById(req.user.userId));
  res.status(StatusCodes.OK).json({ user });
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError(
      "Please provide old and new passwords"
    );
  }

  const user = await User.findById(req.user.userId);
  const passwordsMatch = await user.comparePasswords(oldPassword);

  if (!passwordsMatch) {
    throw new CustomError.UnauthenticatedError("Old password is not correct");
  }

  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: "password changed successfully" });
};

const updateUser = async (req, res) => {
  const { name, email } = req.body || req.user;

  if (!name || !email) {
    throw new CustomError.BadRequestError(
      "Please provide new email and password"
    );
  }

  const user = await User.findByIdAndUpdate(
    req.user.userId,
    {
      name: name,
      email: email,
    },
    { new: true, runValidators: true }
  );
  const tokenUser = await user.attachCookie({ user, res });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};

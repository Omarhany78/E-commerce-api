const Review = require("../models/Review");
const Product = require("../models/Product");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { checkPermissions } = require("../utils");

const createReview = async (req, res) => {
  const productId = req.body.product;

  const productExist = await Product.findById(productId);
  if (!productExist) {
    throw new CustomError.NotFoundError(
      `There is no product with id ${productId}`
    );
  }

  const isAlreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });
  if (isAlreadySubmitted) {
    throw new CustomError.BadRequestError("You've already made a review");
  }

  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({}).populate({
    path: "product",
    select: "name company price",
  });
  res.status(StatusCodes.OK).json({ count: reviews.length, reviews });
};

const getSingleReview = async (req, res) => {
  const reviewId = req.params.id;
  const review = await Review.findById(reviewId);

  if (!review) {
    throw new CustomError.NotFoundError(`No review with id ${reviewId}`);
  }

  res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const { rating, title, comment } = req.body;
  const review = await Review.findByIdAndUpdate(
    reviewId,
    {
      rating,
      title,
      comment,
    },
    { new: true, runValidators: true }
  );

  if (!review) {
    throw new CustomError.NotFoundError(`No review with id ${reviewId}`);
  }

  checkPermissions(req.user, review.user);
  await review.save();
  res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findById(reviewId);

  if (!review) {
    throw new CustomError.NotFoundError(`No review with id ${reviewId}`);
  }

  checkPermissions(req.user, review.user);
  await review.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "Review deleted successfully" });
};

const deleteAllReviews = async (req, res) => {
  await Review.deleteMany();
  res.status(StatusCodes.OK).json({ msg: "Deleted successfully" });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  deleteAllReviews,
};

const express = require("express");
const router = express.Router();

const {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  deleteAllReviews,
} = require("../controllers/revirewController");

router.get("/", getAllReviews);
router.get("/:id", getSingleReview);
router.post("/", createReview);
router.patch("/:id", updateReview);
router.delete("/:id", deleteReview);
router.delete("/", deleteAllReviews);

module.exports = router;

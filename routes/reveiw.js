const express = require("express");
const route = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { validateReview, isLogedIn, isReviewAuthor } = require("../middleware");

// Reviews controller
const reviewControllers = require("../controllers/reviews");

// Post Review
route.post(
  "/",
  isLogedIn,
  validateReview,
  wrapAsync(reviewControllers.createReviews)
);

// Delete Review
route.delete(
  "/:reviewId",
  isLogedIn,
  isReviewAuthor,
  wrapAsync(reviewControllers.deleteReviews)
);

module.exports = route;

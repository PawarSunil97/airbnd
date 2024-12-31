const Reviews = require("../models/review");
const Listing = require("../models/listing");

module.exports.createReviews = async (req, res) => {
  let listing = await Listing.findById(req.params.id); // Access id from the param
  let newReview = new Reviews(req.body.review);

  newReview.author = req.user._id;
  console.log(newReview);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "Reveiw added successfully");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReviews = async (req, res) => {
  const { id, reviewId } = req.params;

  // First, pull the review from the listing's reviews array
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

  // Then, delete the review document
  await Reviews.findByIdAndDelete(reviewId);

  // Redirect back to the listing page
  req.flash("success", "Reveiw Deleted successfully");
  res.redirect(`/listings/${id}`);
};

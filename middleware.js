// Middleware: Redirect to "/users/login" if not authenticated
const ExpressErrors = require("./utils/ExpressErrors");
const { listingSchema, reviewValidationSchema } = require("./schema");
const Listing = require("./models/listing");
const Review = require("./models/review");

module.exports.isLogedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must be login to create listing");
    return res.redirect("/loginuser");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You are  not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let {id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are  not the author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMes = error.details.map((el) => el.message).join(",");
    throw new ExpressErrors(400, errMes);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewValidationSchema.validate(req.body);
  if (error) {
    let errMes = error.details.map((el) => el.message).join(",");
    throw new ExpressErrors(400, errMes);
  } else {
    next();
  }
};

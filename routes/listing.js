const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");

const { isLogedIn, isOwner, validateListing } = require("../middleware"); // Correctly import the specific middleware

// controllers
const listingControllers = require("../controllers/listings");
const multer  = require('multer');
const {storage}= require("../cloudConfig");
const upload = multer({ storage })

// const mapApi= require("@maptiler/sdk");
// Index route
router
  .route("/")
  .get(wrapAsync(listingControllers.Index)) // Show all listings
  .post(
    isLogedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingControllers.createNewListing)
  ); // Create new listing

// New listing form
router.get("/new", isLogedIn, listingControllers.renderNewForm);

// Routes for individual listings
router
  .route("/:id")
  .get(wrapAsync(listingControllers.showListing)) // Show specific listing
  .put(
    isLogedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingControllers.updateRecored)
  ) // Update specific listing
  .delete(isLogedIn, isOwner, wrapAsync(listingControllers.deleteListing)); // Delete specific listing

// Edit listing form
router.get(
  "/:id/edit",
  isLogedIn,
  isOwner,
  wrapAsync(listingControllers.EditListing)
);

module.exports = router;

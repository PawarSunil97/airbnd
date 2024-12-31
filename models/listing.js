const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Reviews = require("./review");
const listingSchema = new Schema({
  title: { type: String, required: true }, // Title is required
  description: { type: String, required: true }, // Description is required
  image: {
    url:String,
    filename: String, // Default filename
  }, // Optional
  price: { type: Number, required: true }, // Price is required
  location: { type: String, required: true }, // Location is required
  country: { type: String, required: true }, // Country is required
  coordinates: { 
    type: [Number],  // Array of numbers [longitude, latitude]
    required: true, // Ensure coordinates are always provided
  }, 
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",// Reference to the User model
  },
});

// if we delete listing that time currosponding all review will be delete
listingSchema.post("findOneAndDelete", async (listing) => {
  if(listing){

    await Reviews.deleteMany({ _id: { $in: listing.reviews } });
  }
});
const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;

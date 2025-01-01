const Listing = require("../models/listing");

module.exports.Index = async (req, res) => {
  const { q } = req.query; // Extract search query
  let AllListing;
  if(q){
    const regex = new RegExp(q, "i");
    AllListing = await Listing.find({
      $or: [{ title: regex }]
    });
  }else{

     AllListing = await Listing.find({});
  }
  res.render("listings/index", { AllListing, searchQuery: q  });
};
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show", { listing });
};

module.exports.createNewListing = async (req, res, next) => {
  

  const url = req.file.path;
  const fileName = req.file.fileName;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, fileName };  
  newListing.save();
  
  req.flash("success", "New Listing created");
  res.redirect("/listings");
};

module.exports.EditListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    res.redirect("/listings");
  }
  res.render("listings/edit", { listing });
};

module.exports.updateRecored = async (req, res) => {
  let { id } = req.params;

  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    const url = req.file.path;
    const fileName = req.file.fileName;
    listing.image = { url, fileName };
    listing.save();
  }
  req.flash("success", "updated record successfully");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "list deleted successfully");
  res.redirect("/listings");
};

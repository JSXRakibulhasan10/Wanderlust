const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const { reviewSchema } = require("./schema.js");
const review = require("./models/review.js");


module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in first to Add a listing");
    return res.redirect("/login");
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
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  // currUser না থাকলে redirect করবে — এটা বারবার reload এর কারণ হতে পারে
  if (!res.locals.currUser) {
    req.flash("error", "You must be logged in!");
    return res.redirect("/login");
  }

  // owner নেই বা match করে না
  if (!listing.owner || !listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have permission to edit this!");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

//validation Schema middleware
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    console.log(errMsg);
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//Validate Review Middleware
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};


module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);

  if (!review) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  // currUser না থাকলে redirect করবে — এটা বারবার reload এর কারণ হতে পারে
  if (!res.locals.currUser) {
    req.flash("error", "You must be logged in!");
    return res.redirect("/login");
  }

  // owner নেই বা match করে না
  if (!review.author || !review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have permission to delete this!");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

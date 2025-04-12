const express=require("express");
const router=express.Router({mergeParams : true});
const Review=require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js"); 
const Listing=require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/review.js");


//Reviews Post Route
router.post("/", isLoggedIn, validateReview , wrapAsync(reviewController.post));
  

//Reviews Destroy Route
 router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroy));


 module.exports= router;
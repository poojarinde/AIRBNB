const express=require("express");
const router=express.Router();
const wrapAync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {reviewSchema}=require("./schema.js");
const Review=require("./models/review.js");
const Listing=require("../models/listing.js");

router.post("/",validateReview,wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}));

//Delete Route
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
       let {id,reviewId}=req.params;
       await Listing.findByIdAndUpdate(id,{ $pull:{reviews:reviewId}});
       await Review.findByIdAndDelete(reviewId);
       res.redirect(`/listings/${id}`);
   }));
module.exports=router;
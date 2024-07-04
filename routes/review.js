const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const validateReview=(req,res,next) => {
    
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};

router.post("/",validateReview,wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","New review created!");
    res.redirect(`/listings/${listing._id}`);
}));

//Delete Route
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
       let {id,reviewId}=req.params;
       await Listing.findByIdAndUpdate(id,{ $pull:{reviews:reviewId}});
       await Review.findByIdAndDelete(reviewId);
       req.flash("success","New review created!");
       res.redirect(`/listings/${id}`);
   }));
module.exports=router;
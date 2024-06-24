const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const Review=require("./models/review.js");


const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust"

main().then(()=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.log("Error");
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res)=>{
    res.send("Hii,I am root");
});

const validateListing=(req,res,next) => {
    
        let {error}=listingSchema.validate(req.body);
        if(error){
            let errMsg=error.details.map((el)=>el.message).join(",");
            throw new ExpressError(400,errMsg);
        }
        else{
            next();
        }
}

const validateReview=(req,res,next) => {
    
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}
//Index Route
app.get("/listings",wrapAync(async(req,res)=>{
 const allListings =  await Listing.find({});
 res.render("listings/index.ejs",{ allListings });
})
);

//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})

//show route

app.get("/listings/:id",wrapAync(async(req,res)=>{
   let {id}=req.params;
  const listing= await Listing.findById(id);
  res.render("listings/show.ejs",{listing});
}));

//create route
app.post("/listings",validateListing,wrapAync(async(req,res,next)=>{
  const newListing=new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
})
);
//edit route
app.get("/listings/:id/edit",wrapAync(async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

//update route
app.put("/listings/:id",validateListing,wrapAync(async(req,res)=>{
   
   let {id}=req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
   res.redirect(`/listings/${id}`);

}));

//Delete route
app.delete("/listings/:id",wrapAync(async(req,res)=>{
    let {id}=req.params;
    let deleteListing=await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings");
}));

//Review route
//Post Route
app.post("/listings/:id/reviews",validateReview,wrapAync(async(req,res)=>{
     let listing=await Listing.findById(req.params.id);
     let newReview=new Review(req.body.review);

     listing.reviews.push(newReview);

     await newReview.save();
     await listing.save();
     res.redirect(`/listings/${listing._id}`);
}));




// app.get("/testListing",async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"My New Villa",
//         description:"By the beach",
//         price:1200,
//         location:"Calangute,Goa",
//         country:"India",
//     });
//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("Successfull testing");
// });

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
})

app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went wrong!"}=err;
    res.status(statusCode).render("error.ejs",{message});

    // res.status(statusCode).send(message);
})

app.listen(8080,()=>{
    console.log("server is listing to port 8080");
});

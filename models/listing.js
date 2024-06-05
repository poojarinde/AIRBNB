const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
    url:{

        type:String,
        default:
            "https://images.unsplash.com/photo-1713783475818-3fdb1a156d79?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            
        set:(v)=>v==="" ? "https://images.unsplash.com/photo-1713783475818-3fdb1a156d79?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
         :v,
    },
    filename:{
        type:String,
        default:"listingimage",
    },
},
    price:Number,
    location:String,
    country:String,
});
const Listing=mongoose.model("Listing",listingSchema);
module.exports= Listing;

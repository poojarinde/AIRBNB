const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
// const user = require("../models/user");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup",async(req,res)=>{
    let {username,email,password}=req.body;
    const newUser=new User({email,username});

    const registeredUser= await User.register(newUser,password);
    console.log(registeredUser);
    req.flash("success","Welcome to wanderlust!");
    res.redirect("/listings");
});
module.exports=router;

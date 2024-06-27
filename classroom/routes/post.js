const express=require("express");
const router=express.Router();
//POSTS
//Index posts

router.get("/",(req,res)=>{
    res.send("Get for posts id");
})
//show posts
router.get("/:id",(req,res)=>{
    res.send("Get for show posts id");
})
//Post posts
router.post("/",(req,res)=>{
    res.send("POST for posts id");
})
//Post posts
router.delete("/:id",(req,res)=>{
    res.send("DELETE for posts id");
})
module.exports=router;

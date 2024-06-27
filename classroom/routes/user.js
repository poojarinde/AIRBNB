const express=require("express");
const router=express.Router();
//Index user
router.get("/",(req,res)=>{
    res.send("Get for users id");
})
//show user
router.get("/:id",(req,res)=>{
    res.send("Get for show users id");
})
//Post user
router.post("/",(req,res)=>{
    res.send("POST for users id");
})
//Post user
router.delete("/:id",(req,res)=>{
    res.send("DELETE for users id");
})

module.exports=router;
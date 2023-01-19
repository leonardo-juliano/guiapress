const express = require("express");
const router =  express.Router();


router.get("/admin/users",(req,res)=>{
    res.send("testando");
})

router.get("/admin/users/create", (req, res)=>{
    res.render("admin/users/create");
});

module.exports = router;
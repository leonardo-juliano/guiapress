const express = require("express");
const router =  express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");


router.get("/admin/users",(req,res)=>{
    User.findAll().then(users =>{
        res.render("admin/users/index",{users:users});
    });
});

router.get("/users/login", (req, res)=>{
    res.render("admin/users/login");
});

router.get("/authenticate", (req,res)=>{
    let email = req.body.email;
    let password = req.body.password;
    
    User.findOne({
        where:{
            email: email
        }
    }).then( user => {
        if( email != undefined){
            let correct = bcrypt.compareSync(password, user.password);

            if(correct){
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.send("certo")
                res.json(req.session.user)
            }else{
                res.send("nao ta igual a senha")
            }

        }else{
            res.send("não tem esse registro no bd")
        }
    })
    
});


router.get("/admin/users/create", (req, res)=>{
    res.render("admin/users/create");
});

router.post("/users/create",(req,res)=>{
    var email = req.body.email;
    var password = req.body.password;
    var name = req.body.name;

    User.findOne({
        where:{
            email:email
        }
    }).then(user => {
        if( user == undefined){
            //utilizando o bcrypt para gerar o hash da senha para guardar no BD 
            let salt = bcrypt.genSaltSync(10); 
            let hash = bcrypt.hashSync(password,salt);

            User.create({
                name:name,
                email:email,
                password:hash
            }).then(()=>{
                res.redirect("/");
            });        
        }else{
            res.redirect("/");
        }
    });
});

router.post("/user/delete",(req,res)=>{
    var id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){
            User.destroy({
                where:{
                    id:id
                }
            }).then(()=>{
                    res.redirect("/admin/users")
                });
        }else{
            res.redirect("/admin/users");
        }
    }else{
        res.redirect("/admin/users");
    }
});



module.exports = router;
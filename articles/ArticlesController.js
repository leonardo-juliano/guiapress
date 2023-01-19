const express = require("express");
const router =  express.Router();
const Category = require("../categories/Category")
const Article = require("./Article");
const slugify = require("slugify")

router.get("/admin/articles/new", (req, res) => {
    Category.findAll().then(categories =>{
        res.render("admin/articles/new", {categories:categories});
    })
    
});

router.get("/admin/articles", (req, res)=>{
    Article.findAll({
        include:[{model: Category}] //sequelize esta fazendo o JOIN, esta pegando o model Category e incluindo em article, como ja fez o relacionamento agora esta fazendo o join
    }).then(articles =>{
        res.render("admin/articles/index", {articles:articles})
    })
})

router.post("/articles/save",(req, res) => {
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(() => {
        res.redirect("/");
    });
});

router.post("/articles/delete",(req,res)=>{
    var id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){
            Article.destroy({
                where:{
                    id:id
                }
            }).then(()=>{
                    res.redirect("/admin/articles")
                });
        }else{
            res.redirect("/admin/articles");
        }
    }else{
        res.redirect("/admin/articles");
    }
});

router.get("/admin/articles/edit/:id", (req,res)=> {
    let id = req.params.id;
    Article.findByPk(id).then(article =>{
        if(article != undefined){
            Category.findAll().then(categories =>{
                res.render("admin/articles/edit", {categories, categories, article:article})
            })
        }else{
            res.redirect("/")
        }
    }).catch((error)=>{
        res.redirect("/")
    })
});

router.post("/articles/update",(req,res)=>{
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Article.update({
        title:title, body:body, categoryId:category, slug:slugify(title)
    },{
        where:{
            id:id
        }
    }
    ).then(()=>{
        res.redirect("admin/articles")}
    ).catch(error =>{
        res.redirect(error)}
    );
});

router.get("/articles/page/:num", (req,res)=>{
    var page = req.params.num;
    var offset = 0;
    var pageAnterior = page - 1;
    var pageProximo = parseInt(page) + 1;



    console.log("numero da page é:" + pageAnterior);
    if(isNaN(page) || page == 1 ){
        offset = 0;
    }else{
        offset= parseInt(page) * 4;
    }

    Article.findAndCountAll({
        limit: 4,
        offset:offset
    }).then(articles =>{
        

        var next;
        if(offset + 4 >= articles.count){
            next = false;
        }else{
            next=true;
        }

        var result = {
            next: next,
            articles:articles
        }

        var anterior;
        if(offset-1 < 0){
            anterior = false
        }else{
            anterior=true;
        }
        var result2 = {
            anterior: anterior,
            articles:articles
        }

        
        Category.findAll().then(categories =>{
            res.render("admin/articles/page", {result: result, categories:categories, pageAnterior:pageAnterior, pageProximo:pageProximo})
            
        });

    }).catch(error =>{
        res.redirect("/");
        console.log(error);
    })
})


module.exports = router;


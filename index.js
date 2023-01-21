const express = require("express");
const bodyParser = require("body-parser");
const connection = require("./database/database");

//importando os controllers com os router
const categoriesController = require("./categories/CategoriesController")
const articleController = require("./articles/ArticlesController");
const userController = require("./users/UsersController");

//importando os models
const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./users/User");

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const session = require("express-session")


app.set('view engine', 'ejs');

app.use(session({
    secret: "qualquercoisa",
    cookie:{
        maxAge: 30000
    }
}));

app.get("/",(req, res)=>{
    Article.findAll(({
        limit: 4,
        order:[
            ['id','DESC'],
            
        ]
    })).then(articles => {
        Category.findAll().then(categories=>{
            res.render("index", {articles: articles, categories:categories});
        })
        
    });
});

app.get("/:slug", (req,res)=>{
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article =>{
        if(article != undefined){
            res.render("article", {article:article})
        }else{
            res.redirect("/")
        }

    }).catch( err=>{
        res.redirect("/")
    })
})

app.get("/category/:slug", (req, res)=> {
    var slug = req.params.slug;
    Category.findOne({
        where: {
            slug:slug
        },
        include: [{model: Article}]
    }).then( category => {
        if(category != undefined){
            Category.findAll().then(categories => {
                res.render("index",{articles: Category.articles, categories: categories});
            })

        }else{
            res.redirect("/")
        }
    }).catch( err=>{
        res.redirect("/")
    })
})

connection
    .authenticate()
    .then(()=>{
    console.log("conexão feita com sucesso");
    })
    .catch((msgErro)=>{
    console.log(msgErro)
    });


app.use("/",categoriesController);//utilizando as rotas que contem dentro do arquivo categoriesController
app.use("/",articleController);
app.use("/",userController);



app.use(express.static('public'));
app.listen(9090,()=>{
    console.log("Servidor rodando");
});


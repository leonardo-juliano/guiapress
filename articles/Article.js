const Sequelize = require("sequelize");
const connection = require("../database/database")
const Category = require("../categories/Category"); //importando o category para fazer o relacionamento

const Article = connection.define('articles',{
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

Category.hasMany(Article); //relacionamento 1-P-M
Article.belongsTo(Category); //BelongsTo é o relacionamento 1-P-1 no sequelize

module.exports = Article;
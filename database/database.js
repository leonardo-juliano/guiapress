const Sequelize = require("sequelize");

const connection = new Sequelize('guiapress','root','123456',{
    host: 'localhost', //aonde a aplicação esta rodando
    dialect: 'mysql', //tipo de banco de dados 
    timezone: "-03:00"
});

module.exports = connection;
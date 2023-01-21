const Sequelize = require("sequelize");
const connection = require("../database/database")

const User = connection.define('users',{
    name:{
        type: Sequelize.STRING,
        allowNull: false
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

//User.sync({force : true}); //forçar criaçao da tabela no banco de dados

module.exports = User;
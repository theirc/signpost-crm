var Sequelize = require('sequelize');
require('dotenv').config();

const db = {}

const sequelize = new Sequelize(process.env.DBNAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql',
    operatorAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})

db.sequalize = sequelize
db.Sequalize = Sequelize

module.exports = db;
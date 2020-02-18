const Sequelize = require('sequelize');
const db = require('../config/db');

const Category = db.sequalize.define(
        'category', 
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: Sequelize.STRING
            },
            country: {
                type: Sequelize.STRING
            },
            enabled: {
                type: Sequelize.INTEGER
            },
        })
module.exports = Category;

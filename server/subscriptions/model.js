const Sequelize = require('sequelize');
const db = require('../config/db');

const Subscriptions = db.sequelize.define(
        'subscription', 
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            phone: {
                type: Sequelize.STRING
            },
            category: {
                type: Sequelize.STRING
            },
            categorySlug:{
                type: Sequelize.STRING
            },
            categoryId: {
                type: Sequelize.STRING
            },
            active: {
                type: Sequelize.BOOLEAN
            },
            code: {
                type: Sequelize.STRING
            },
        })
module.exports = Subscriptions;

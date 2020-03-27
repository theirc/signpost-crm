const Sequelize = require('sequelize');
const db = require('../config/db');

const Notifications = db.sequelize.define(
    'notification',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        phone: {
            type: Sequelize.STRING
        },
        categoryId: {
            type: Sequelize.STRING
        },
        articleId:{
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.STRING
        },
        readtTime: {
            type: Sequelize.DATE
        }
    }
)
module.exports = Notifications;

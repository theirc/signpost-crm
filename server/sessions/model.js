const Sequelize = require('sequelize');
const db = require('../config/db');
const Category = require('../categories/model');

const Session = db.sequalize.define(
        'session', 
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
                type: Sequelize.INTEGER,
                references:{
                    model: Category,
                    key: 'id'
                }
            },
            notes: {
                type: Sequelize.STRING
            },
            user: {
                type: Sequelize.INTEGER
            },
            tags: {
                type: Sequelize.STRING
            },
            followup: {
                type: Sequelize.BOOLEAN
            }
        })
module.exports = Session;

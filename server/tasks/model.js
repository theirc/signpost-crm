const Sequelize = require('sequelize');
const db = require('../config/db');

const Task = db.sequalize.define(
        'task', 
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            phone: {
                type: Sequelize.STRING
            },
            summary: {
                type: Sequelize.STRING,

            },
            description: {
                type: Sequelize.STRING
            },
            user: {
                type: Sequelize.INTEGER
            },
            due_on: {
                type: Sequelize.DATE
            }
        })
module.exports = Task;

const Sequelize = require('sequelize');
const db = require('../config/db');

const User = db.sequalize.define(
        'user', 
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: Sequelize.STRING
            },
            lastName: {
                type: Sequelize.STRING
            },
            role: {
                type: Sequelize.STRING
            },
            country: {
                type: Sequelize.STRING
            },
            initials: {
                type: Sequelize.STRING
            }
        })
module.exports = User;

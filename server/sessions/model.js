const Sequelize = require('sequelize');
const db = require('../config/db');
const Category = require('../categories/model');

const Session = db.sequelize.define(
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
            notes: {
                type: Sequelize.STRING
            },
            user: {
                type: Sequelize.INTEGER
            },
            tags: {
                type: Sequelize.STRING
            },
            followUp: {
                type: Sequelize.BOOLEAN
            },
            messageSent:{
                type: Sequelize.BOOLEAN,
                defaultValue: false

            },
            messageSid: {
                type: Sequelize.STRING
            },
            messageStatus: {
                type: Sequelize.STRING
            }
        })
module.exports = Session;

exports.Session_Categories = db.sequelize.define('session_categories', {
    SessionId: {
      type: Sequelize.INTEGER,
      references: {
        model: Session, 
        key: 'id'
      }
    },
    CategoryId: {
      type: Sequelize.INTEGER,
      references: {
        model: Category, 
        key: 'id'
      }
    }
  });

//const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const request = require('request');
const roles = require('../config/roles');
const Session = require('./model');
const Category = require('../categories/model');
require('dotenv').config();


exports.categoryList = async (req, res, next) => {
    
    Category.findAndCountAll({
        order: [['createdAt', 'DESC']]
    }).then(categories => res.send(categories))
    
  };


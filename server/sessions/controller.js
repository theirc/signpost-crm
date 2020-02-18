//const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const services = require('./services');
const { getList } = services;
const request = require('request');
const roles = require('../config/roles');
const Session = require('./model');
const Category = require('../categories/model');

Session.belongsTo(Category);
exports.sessionsList = async (req, res, next) => {
    const { user } = req;
    const { phone } = req.query;
    let where = phone ? { phone: phone} : {};
    if (user && user.role == roles.MODERATOR){
        where.user = user.id;
    }
    Session.findAndCountAll({
        where: where,
        include: [
            {model: Category}
        ],
        order: [['createdAt', 'DESC']],
        limit: 20
    }).then(sessions => res.send(sessions))
    
  };

exports.getSession = async (req, res, next) =>{
    const { user } = req;
    
}

exports.newSession = async (req, res, next) => {
    const {user} = req;
    Session.build({
        phone: req.body.phone,
        categoryId: req.body.category,
        notes: req.body.notes,
        tags: req.body.tags,
        user: user.id,
    }).save();
    res.send(true);
}

exports.updateSession = async (req, res, next) =>{

}

exports.deleteSession = async (req, res, next) =>{

}
//const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const services = require('./services');
const { getList } = services;
const request = require('request');
const roles = require('../config/roles');
const Task = require('./model');

exports.tasksList = async (req, res, next) => {
    const { user } = req;
    const { phone } = req.query;
    let where = phone ? { phone: phone} : {};
    if (user && user.role == roles.MODERATOR){
        where.user = user.id;
    }
    Task.findAndCountAll({
        where: where,
        order: [['createdAt', 'DESC']],
        limit: 20
    }).then(tasks => res.send(tasks))
    
  };

exports.getTask = async (req, res, next) =>{
    const { user } = req;
    
}

exports.newTask = async (req, res, next) => {
    const { user } = req;
    Task.build({
        phone: req.body.phone,
        summary: req.body.summary,
        description: req.body.description,
        due_on: req.body.dueDate,
        user: user.id,
    }).save();
    res.send(true);
}

exports.updateTask = async (req, res, next) =>{

}

exports.deleteTask = async (req, res, next) =>{

}
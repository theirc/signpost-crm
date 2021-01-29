//const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const request = require('request');
const roles = require('../config/roles');
const Session = require('./model');
const Category = require('../categories/model');
require('dotenv').config();


exports.categoryList = async (req, res, next) => {
    let where = req.user.country ? { country: req.user.country } : {};
    Category.findAndCountAll({
        order: [['name', 'ASC']],
        where: where
    }).then(categories => res.send(categories))
  };

exports.addCategory = async(req, res, next) => {
    const { name, enabled, country } = req.body;
    try{
        let category = await Category.build({
            name: name,
            enabled, enabled,
            country: country
        }).save();
        res.send(category);
    }catch(err){
        res.send(err);
    }


}

exports.editCategory = async(req, res, next) => {
    const { id, name, enabled, country} = req.body;
    try{
        let category = await Category.update({
            name: name,
            enabled: enabled,
            country: country
        },
        {where: {id: id}}
        )
        res.send(category);
    }catch(err){
        res.send(err);
    }

}

exports.removeCategory = async(req, res, next) => {
    const {id } = req.body;
    try{
        let category= await Category.destroy({where: {id: id}});
        res.send(category)
    }catch(err){
        res.send(err);
    }


}
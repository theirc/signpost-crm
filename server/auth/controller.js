//const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const services = require('./services');
const { getUser, getList } = services;
const request = require('request');
const User = require('./model');
require('dotenv').config();

exports.login = async (req, res, next) => {
    var token = {};
    try {
        User.findOne({where: {username: req.body.username}, limit: 1})
        .then((user) => {
            return user;
        })
        .then(user => {
            if (user){
                let formData = { username: req.body.username, password: req.body.password}
                request.post({url: 'https://auth.rescue.org/SimpleAuthenticationRESTService.aspx', formData: formData},
                    function(error, response, body){
                        jbody = JSON.parse(body);
                        if (!error && response.statusCode == 200 && jbody.result){
                            //User authenticated
                            jwt.sign({user}, process.env.JWT_SECRET, { expiresIn: '86400s' }, (err, token) => {
                                res.json({ token: token, user: user });
                            })
                        }else{
                            res.send(false);
                        }
                    }
                )
            }else{
                return res.send(false);
            }
        }).catch(err => res.status(500).send(err))
    } catch (error) {
        return next(error);
    }
  };

  exports.getUserList = async (req, res, next) => {
      const { instance } = req.body;
      let list = await getList(instance);
      res.send(list);
  }
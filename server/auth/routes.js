const express = require('express');
const validate = require('express-validation');
const controller = require('./controller');
const cors = require('cors');
const router = express.Router();
const { login } = require('./validations');
const User = require('./model');
const verifyToken = require('../middleware/auth');

//router.route('/login').post(validate(login), controller.login);
router.route('/login').post(controller.login);
router.route('/').get(verifyToken, (req, res ,next) => {
    console.log(req.user);

    User.findAll().then(users => { res.json(users)})
})
module.exports = router;

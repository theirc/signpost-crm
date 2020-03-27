const express = require('express');
const validate = require('express-validation');
const controller = require('./controller');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.route('/').get(verifyToken, controller.categoryList);
module.exports = router;

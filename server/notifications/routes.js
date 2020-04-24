const express = require('express');
const validate = require('express-validation');
const controller = require('./controller');

const router = express.Router();

router.route('/').get(controller.getList);
module.exports = router;

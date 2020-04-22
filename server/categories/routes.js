const express = require('express');
const validate = require('express-validation');
const controller = require('./controller');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.route('/').get(verifyToken, controller.categoryList);
router.route('/').post(verifyToken, controller.addCategory);
router.route('/').put(verifyToken, controller.editCategory);
router.route('/').delete(verifyToken, controller.removeCategory);

module.exports = router;

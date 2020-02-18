const express = require('express');
const validate = require('express-validation');
const controller = require('./controller');
const verifyToken = require('../middleware/auth')
const router = express.Router();

router.route('/').get(verifyToken, controller.tasksList);
// router.route('/getTask').get(controller.getTask);
router.route('/').post(verifyToken, controller.newTask);
// router.route('/').put(controller.updateTask);
// router.route('/').delete(controller.deleteTask);

module.exports = router;

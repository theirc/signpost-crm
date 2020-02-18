const express = require('express');
const validate = require('express-validation');
const controller = require('./controller');
const verifyToken = require('../middleware/auth');
const { session } = require('./validations');

const router = express.Router();


router.route('/').get(verifyToken, controller.sessionsList);
router.route('/:id').get(verifyToken, controller.getSession);
router.route('/').post(verifyToken, controller.newSession);
router.route('/:id').put(verifyToken, controller.updateSession);
router.route('/:id').delete(verifyToken, controller.deleteSession);

module.exports = router;

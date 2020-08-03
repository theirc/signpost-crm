const express = require('express');
const validate = require('express-validation');
const controller = require('./controller');
const verifyToken = require('../middleware/auth');
const { session } = require('./validations');
const services = require('./services');
const router = express.Router();

router.route('/').get(verifyToken, controller.sessionsList);
router.route('/:id').get(verifyToken, controller.getSession);
router.route('/').post(verifyToken, controller.newSession);
router.route('/send-message').post(verifyToken, controller.sendMessage);
router.route('/send-message-messenger').post(verifyToken, controller.sendMessageMessenger);
router.route('/check-status').post(verifyToken, controller.checkStatus);
router.route('/is-reconnecting').post(controller.isReconnecting);
router.route('/get-logs').post(controller.getLogs);

router.route('/export').post(services.getCategoriesStats);

module.exports = router;

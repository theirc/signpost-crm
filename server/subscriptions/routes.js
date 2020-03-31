const express = require('express');
const validate = require('express-validation');
const controller = require('./controller');

const router = express.Router();

router.route('/ping').post(controller.ping);
router.route('/add-subscription').post(controller.addSubscription);
router.route('/verify-code').post(controller.verifyCode);
router.route('/trigger-notifications').post(controller.triggerNotifications);
module.exports = router;

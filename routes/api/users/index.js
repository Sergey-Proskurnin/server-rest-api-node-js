const express = require('express');
const router = express.Router();
const guard = require('../../../helpers/guard');
const { upload } = require('../../../helpers');
const {
  validationPаramsUser,
  validationSubscriptionUser,
  validationVerificationEmail,
} = require('./validation');

const { users: ctrl } = require('../../../controllers');

router.patch('/', guard, validationSubscriptionUser, ctrl.subscriptionUpdate);
router.patch('/avatars', guard, upload.single('avatar'), ctrl.avatars);
router.post('/signup', validationPаramsUser, ctrl.register);
router.post('/login', validationPаramsUser, ctrl.login);
router.post('/logout', guard, ctrl.logout);
router.get('/current', guard, ctrl.current);
router.get('/verify/:verificationToken', ctrl.verify);
router.post('/verify', validationVerificationEmail, ctrl.repeatEmailVerify);

module.exports = router;

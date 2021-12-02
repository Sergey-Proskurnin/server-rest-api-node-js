const express = require('express');
const router = express.Router();
// const { guard, guardRefresh } = require('../../../helpers');
const guard = require('../../../helpers/guard');
const { upload, guardRefresh } = require('../../../helpers');
const {
  validationPаramsUserSignup,
  validationPаramsUserLogin,
  validationSubscriptionUser,
  validationVerificationEmail,
  validationPаramsUserInfo,
} = require('./validation');

const { users: ctrl } = require('../../../controllers');

router.patch('/', guard, validationSubscriptionUser, ctrl.subscriptionUpdate);
router.patch(
  '/avatars',
  guard,
  upload.single('avatar'),
  validationPаramsUserInfo,
  ctrl.avatars,
);
router.post('/signup', validationPаramsUserSignup, ctrl.register);
router.post('/login', validationPаramsUserLogin, ctrl.login);
router.post('/logout', guard, ctrl.logout);
router.get('/current', guard, ctrl.current);
router.get('/verify/:verificationToken', ctrl.verify);
router.post('/verify', validationVerificationEmail, ctrl.repeatEmailVerify);
router.get('/refresh', guardRefresh, ctrl.refresh);

module.exports = router;

const register = require('./register');
const login = require('./login');
const logout = require('./logout');
const current = require('./current');
const refresh = require('./refresh');
const subscriptionUpdate = require('./subscriptionUpdate');
const avatars = require('./avatars');
const verify = require('./verify');
const repeatEmailVerify = require('./repeatEmailVerify');
const { googleAuth, googleRedirect } = require('./authGoogle');
const { facebookAuth, facebookRedirect } = require('./authFacebook');

module.exports = {
  register,
  login,
  logout,
  current,
  refresh,
  subscriptionUpdate,
  avatars,
  verify,
  repeatEmailVerify,
  googleAuth,
  googleRedirect,
  facebookAuth,
  facebookRedirect,
};

const passport = require('passport');
require('../config/passport');
const {
  HttpCode: { UNAUTHORIZED },
} = require('./constants');

const guard = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (error, dataUser) => {
    const headerAuth = req.get('Authorization');
    let token = null;
    if (headerAuth) {
      token = headerAuth.split(' ')[1];
    }

    if (error) {
      return res.status(UNAUTHORIZED).json({
        status: 'error',
        code: UNAUTHORIZED,
        message: error.message,
      });
    }
    if (!dataUser.user || token !== dataUser.user?.token) {
      return res.status(UNAUTHORIZED).json({
        status: 'error',
        code: UNAUTHORIZED,
        message: 'Unvalid token',
      });
    }

    req.user = dataUser.user;
    req.session = dataUser.session;
    return next();
  })(req, res, next);
};

module.exports = guard;

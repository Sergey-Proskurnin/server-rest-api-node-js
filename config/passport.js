const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;
const Users = require('../repositories/users');
const Sessions = require('../repositories/session');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = SECRET_KEY;

passport.use(
  new JwtStrategy(opts, async (payload, done) => {
    try {
      const user = await Users.findById(payload.id);
      const session = await Sessions.addSession(payload.sid);
      if (!user) {
        return done(new Error('User not found'));
      }
      if (!session) {
        return done(new Error('Invalid session'));
      }
      if (!user.token) {
        return done(null, false);
      }
      const dataUser = { user, session };
      return done(null, dataUser);
    } catch (error) {
      done(error, false);
    }
  }),
);

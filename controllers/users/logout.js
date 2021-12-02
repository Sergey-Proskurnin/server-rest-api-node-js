const Users = require('../../repositories/users');
const Sessions = require('../../repositories/session');
const {
  HttpCode: { NO_CONTENT },
} = require('../../helpers');

const logout = async (req, res, next) => {
  try {
    const id = req.user.id;
    const sid = req.session._id;
    await Users.updateToken(id, null, null);
    await Sessions.removeSession(sid, id);
    req.user = null;
    req.session = null;
    return res.status(NO_CONTENT).json({});
  } catch (error) {
    next(error);
  }
};

module.exports = logout;

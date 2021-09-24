const Users = require('../../repositories/users');
const {
  HttpCode: { NO_CONTENT },
} = require('../../helpers');

const logout = async (req, res, next) => {
  try {
    const id = req.user.id;
    await Users.updateToken(id, null);
    return res.status(NO_CONTENT).json({});
  } catch (error) {
    next(error);
  }
};

module.exports = logout;

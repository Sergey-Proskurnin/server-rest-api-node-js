const Users = require('../../repositories/users');
const Sessions = require('../../repositories/session');
const {
  HttpCode: { OK, UNAUTHORIZED },
  createRefreshToken,
  createToken,
} = require('../../helpers');

const login = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);
    const isValidPassword = await user?.isValidPassword(req.body.password);

    if (!user || !isValidPassword) {
      return res.status(UNAUTHORIZED).json({
        status: 'error',
        code: UNAUTHORIZED,
        message: 'Email or password is wrong',
      });
    }
    if (!user.verify) {
      return res.status(UNAUTHORIZED).json({
        status: 'error',
        code: UNAUTHORIZED,
        message: 'User has not verified his email',
      });
    }

    const id = user.id;
    const newSession = await Sessions.create(id);
    const token = createToken(id, newSession._id);
    const refreshToken = createRefreshToken(id, newSession._id);
    const newUser = {
      name: user.name,
      email: user.email,
      avatarURL: user.avatarURL,
    };
    return res.status(OK).json({
      status: 'success',
      code: OK,
      data: { token, refreshToken, user: newUser },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = login;

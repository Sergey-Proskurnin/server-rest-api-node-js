const Users = require('../../repositories/users');
const {
  HttpCode: { OK },
  createToken,
  createRefreshToken,
} = require('../../helpers');
const Sessions = require('../../repositories/session');

const refresh = async (req, res, next) => {
  try {
    const user = req.user;
    const id = user.id;
    const sid = req.session._id;
    await Sessions.removeSession(sid, id);
    const newSession = await Sessions.create(id);

    const newToken = createToken(id, newSession._id);
    const newRefreshToken = createRefreshToken(id, newSession._id);

    const { name, email, avatarURL, token, refreshToken } =
      await Users.updateToken(id, newToken, newRefreshToken);

    res.status(OK).json({
      status: 'success',
      code: OK,
      data: {
        token: token,
        refreshToken: refreshToken,
        user: {
          name,
          email,
          avatarURL,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = refresh;

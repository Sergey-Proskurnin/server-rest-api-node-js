const {
  HttpCode: { OK },
} = require('../../helpers');

const current = async (req, res, next) => {
  try {
    const { name, email, avatarURL } = req.user;
    return res.status(OK).json({
      status: 'success',
      code: OK,
      user: { name, email, avatarURL },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = current;

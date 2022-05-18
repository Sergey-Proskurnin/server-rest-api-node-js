const {
  HttpCode: { OK },
} = require('../../helpers');

const current = async (req, res, next) => {
  try {
    const { name, email, avatarURL, subscription } = req.user;
    return res.status(OK).json({
      status: 'success',
      code: OK,
      user: { name, email, avatarURL, subscription },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = current;

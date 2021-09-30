const {
  HttpCode: { OK },
} = require('../../helpers');

const current = async (req, res, next) => {
  try {
    const { name, email, subscription, avatarURL } = req.user;
    return res.status(OK).json({
      status: 'success',
      code: OK,
      user: { name, email, subscription, avatarURL },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = current;

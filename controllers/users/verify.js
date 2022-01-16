const Users = require('../../repositories/users');
const path = require('path');
const {
  HttpCode: { OK, NOT_FOUND },
} = require('../../helpers');

const verify = async (req, res, next) => {
  try {
    const user = await Users.findByVerifyToken(req.params.verificationToken);
    if (user) {
      await Users.updateTokenVerify(user.id, true, null);
      return res
        .status(OK)
        .sendFile(
          path.join(
            __dirname,
            '../../public/successful-verification-page.html',
          ),
        );
    }
    return res
      .status(NOT_FOUND)
      .json({ status: 'error', code: NOT_FOUND, message: 'User not found' });
  } catch (error) {
    next(error);
  }
};

module.exports = verify;

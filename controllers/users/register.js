const Users = require('../../repositories/users');
const EmailService = require('../../services/email');
const { CreateSenderSendGrid } = require('../../services/email-sender');
const {
  HttpCode: { CREATED, CONFLICT },
} = require('../../helpers');

const register = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);

    if (user) {
      return res.status(CONFLICT).json({
        status: 'error',
        code: CONFLICT,
        message: 'Email in use',
      });
    }
    const { name, email, subscription, avatarURL, verifyToken } =
      await Users.create(req.body);
    try {
      const emailService = new EmailService(
        process.env.NODE_ENV,
        new CreateSenderSendGrid(),
      );
      await emailService.sendVerifyEmail(verifyToken, email, name);
    } catch (error) {
      console.log(error.message);
    }
    return res.status(CREATED).json({
      status: 'success',
      code: CREATED,
      user: { name, email, subscription, avatarURL, verifyToken },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = register;

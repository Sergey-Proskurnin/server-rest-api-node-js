const Users = require('../../repositories/users');
const {
  HttpCode: { OK, NOT_FOUND },
} = require('../../helpers');

const subscriptionUpdate = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { email, subscription } = await Users.updateSubscriptionUser(
      userId,
      req.body.subscription,
    );
    if (email) {
      return res
        .status(OK)
        .json({ status: 'success', code: OK, data: { email, subscription } });
    }
    return res
      .status(NOT_FOUND)
      .json({ status: 'error', code: NOT_FOUND, message: 'Not found' });
  } catch (error) {
    next(error);
  }
};

module.exports = subscriptionUpdate;

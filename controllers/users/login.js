const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;
const Users = require('../../repositories/users');
const {
  HttpCode: { OK, UNAUTHORIZED },
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
    const { email, subscription } = user;
    const id = user.id;
    const payloload = { id, test: 'Hellow mamkin hacker' };
    const token = jwt.sign(payloload, SECRET_KEY, { expiresIn: '4h' });
    await Users.updateToken(id, token);
    return res
      .status(OK)
      .json({
        status: 'success',
        code: OK,
        data: { token, user: { email, subscription } },
      });
  } catch (error) {
    next(error);
  }
};

module.exports = login;

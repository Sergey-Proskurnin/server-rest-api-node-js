const jwt = require('jsonwebtoken');
require('dotenv').config();

const createRefreshToken = (id, sid) => {
  const payloload = { id, sid, test: 'Hellow mamkin hacker 2' };
  const token = jwt.sign(payloload, process.env.SECRET_KEY, {
    expiresIn: '6h',
  });
  return token;
};

module.exports = createRefreshToken;

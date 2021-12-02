const jwt = require('jsonwebtoken');
require('dotenv').config();

const createToken = (id, sid) => {
  const payloload = { id, sid, test: 'Hellow mamkin hacker' };
  const token = jwt.sign(payloload, process.env.SECRET_KEY, {
    expiresIn: '2h',
  });
  return token;
};

module.exports = createToken;

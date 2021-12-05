const jwt = require('jsonwebtoken');
require('dotenv').config();

const createToken = (id, sid) => {
  const payload = { id, sid, test: process.env.PAYLOAD_WORD_TOKEN };
  const token = jwt.sign(payload, process.env.SECRET_KEY_TOKEN, {
    expiresIn: process.env.TOKEN_LIFETIME,
  });
  return token;
};

module.exports = createToken;

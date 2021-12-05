const jwt = require('jsonwebtoken');
require('dotenv').config();

const createRefreshToken = (id, sid) => {
  const payload = { id, sid, test: process.env.PAYLOAD_WORD_REFRESH_TOKEN };
  const token = jwt.sign(payload, process.env.SECRET_KEY_TOKEN, {
    expiresIn: process.env.REFRESH_TOKEN_LIFETIME,
  });
  return token;
};

module.exports = createRefreshToken;

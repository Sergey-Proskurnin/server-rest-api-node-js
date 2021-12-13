const queryString = require('query-string');
const axios = require('axios');

const {
  createToken,
  createRefreshToken,
  env: { HOST, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, FRONTEND_URL },
} = require('../../helpers');

const Users = require('../../repositories/users');
const Sessions = require('../../repositories/session');

const googleAuth = async (_req, res, next) => {
  try {
    const stringifiedParams = queryString.stringify({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: `${HOST}/api/v1/users/google-redirect`,
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ].join(' '),
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent',
    });
    return res.redirect(
      `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`,
    );
  } catch (error) {
    next(error);
  }
};

const googleRedirect = async (req, res, next) => {
  try {
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    const urlObj = new URL(fullUrl);
    const urlParams = queryString.parse(urlObj.search);
    const code = urlParams.code;

    const tokenData = await axios({
      url: `https://oauth2.googleapis.com/token`,
      method: 'post',
      data: {
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: `${HOST}/api/v1/users/google-redirect`,
        grant_type: 'authorization_code',
        code,
      },
    });
    const userData = await axios({
      url: 'https://www.googleapis.com/oauth2/v2/userinfo',
      method: 'get',
      headers: {
        Authorization: `Bearer ${tokenData.data.access_token}`,
      },
    });

    const { email, name, picture, id } = userData.data;

    const user = await Users.findByEmail(email);

    if (!user) {
      const newUser = await Users.create({ email, name, password: id });
      const idUser = newUser.id;
      const newSession = await Sessions.create(idUser);
      await Users.updateAvatarUser(idUser, picture);
      const token = createToken(id, newSession._id);
      const refreshToken = createRefreshToken(id, newSession._id);
      return res.redirect(
        `${FRONTEND_URL}?token=${token}&refreshToken=${refreshToken}`,
      );
    }
    const idUser = user.id;
    await Users.updateUserName(idUser, name);
    const newSession = await Sessions.create(idUser);
    if (
      !user.avatarURL ||
      user?.avatarURL.includes('googleusercontent') ||
      user?.avatarURL.includes('scontent')
    ) {
      await Users.updateAvatarUser(idUser, picture);
    }
    const token = createToken(idUser, newSession._id);
    const refreshToken = createRefreshToken(idUser, newSession._id);

    return res.redirect(
      `${FRONTEND_URL}/contacts?token=${token}&refreshToken=${refreshToken}`,
    );
  } catch (error) {
    next(error);
  }
};

module.exports = { googleAuth, googleRedirect };

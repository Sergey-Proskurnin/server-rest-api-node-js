const queryString = require('query-string');
const axios = require('axios');

const {
  createToken,
  createRefreshToken,
  env: { HOST, FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET, FRONTEND_URL },
} = require('../../helpers');

const Users = require('../../repositories/users');
const Sessions = require('../../repositories/session');

const facebookAuth = async (_req, res, next) => {
  try {
    const stringifiedParams = queryString.stringify({
      client_id: FACEBOOK_CLIENT_ID,
      redirect_uri: `${HOST}/api/v1/users/facebook-redirect/`,
      scope: 'email',
      response_type: 'code',
      auth_type: 'rerequest',
      display: 'popup',
    });
    return res.redirect(
      `https://www.facebook.com/v4.0/dialog/oauth?${stringifiedParams}`,
    );
  } catch (error) {
    next(error);
  }
};

const facebookRedirect = async (req, res, next) => {
  try {
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    const urlObj = new URL(fullUrl);
    const urlParams = queryString.parse(urlObj.search);
    const code = urlParams.code;
    const tokenData = await axios({
      url: 'https://graph.facebook.com/v4.0/oauth/access_token',
      method: 'get',
      params: {
        client_id: FACEBOOK_CLIENT_ID,
        client_secret: FACEBOOK_CLIENT_SECRET,
        redirect_uri: `${HOST}/api/v1/users/facebook-redirect/`,
        code,
      },
    });
    const userData = await axios({
      url: 'https://graph.facebook.com/me',
      method: 'get',
      params: {
        fields: ['email', 'name', 'picture'].join(','),
        access_token: tokenData.data.access_token,
      },
    });

    const { email, name, id, picture } = userData.data;
    const user = await Users.findByEmail(email);
    if (!user) {
      const newUser = await Users.create({
        email,
        name,
        password: id,
      });
      const idUser = newUser.id;
      const newSession = await Sessions.create(idUser);
      await Users.updateAvatarUser(idUser, picture.data.url);
      const token = createToken(idUser, newSession._id);
      const refreshToken = createRefreshToken(idUser, newSession._id);
      return res.redirect(
        `${FRONTEND_URL}/contacts?token=${token}&refreshToken=${refreshToken}`,
      );
    }
    const idUser = user.id;
    await Users.updateUserName(idUser, name);
    if (
      !user.avatarURL ||
      user?.avatarURL.includes('scontent') ||
      user?.avatarURL.includes('googleusercontent')
    ) {
      await Users.updateAvatarUser(idUser, picture.data.url);
    }
    const newSession = await Sessions.create(idUser);
    const token = createToken(idUser, newSession._id);
    const refreshToken = createRefreshToken(idUser, newSession._id);

    return res.redirect(
      `${FRONTEND_URL}/contacts?token=${token}&refreshToken=${refreshToken}`,
    );
  } catch (error) {
    next(error);
  }
};
module.exports = { facebookAuth, facebookRedirect };

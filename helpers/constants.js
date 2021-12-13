require('dotenv').config();

let HOST;
let FRONTEND_URL;

switch (process.env.NODE_ENV) {
  case 'development':
    HOST = process.env.LINK_HOST_DEVELOPMENT;
    FRONTEND_URL = process.env.LINK_HOST_DEFAULT;
    break;
  case 'production':
    HOST = process.env.LINK_HOST_PRODUCTION;
    FRONTEND_URL = process.env.FRONTEND_URL;
    break;
  default:
    HOST = process.env.LINK_HOST_DEFAULT;
    FRONTEND_URL = process.env.FRONTEND_URL_DEFAULT;
    break;
}

const env = {
  HOST,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  FRONTEND_URL,
  FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
};

const HttpCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

const Packages = {
  STARTER: 'starter',
  PRO: 'pro',
  BUSINESS: 'business',
};

const limiterAPI = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  handler: (_req, res, _next) => {
    return res.status(HttpCode.TOO_MANY_REQUESTS).json({
      status: 'error',
      code: HttpCode.TOO_MANY_REQUESTS,
      message: 'Too many requests, please try again later',
    });
  },
};

module.exports = { HttpCode, Packages, limiterAPI, env };

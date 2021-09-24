const Joi = require('joi');

const {
  HttpCode: { BAD_REQUEST },
  validate,
  Packages,
} = require('../../../helpers');

const schemaPаramsrUser = Joi.object({
  password: Joi.string()
    .pattern(/[0-9a-zA-Z!@#$%^&*]{6,}/)
    .required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: false }).required(),
  subscription: Joi.string().optional(),
});

const schemaSubscriptionUser = Joi.object({
  subscription: Joi.string().pattern(/^[a-zA-Z' ']{3,30}$/),
});

const shemaVerifyEmail = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2, tlds: false }).required(),
});

module.exports = {
  validationPаramsUser: (req, res, next) => {
    if ('password' in req.body && 'email' in req.body) {
      return validate(schemaPаramsrUser, req.body, next);
    }
    return res.status(BAD_REQUEST).json({
      status: 'error',
      code: BAD_REQUEST,
      message: 'Missing required name field',
    });
  },
  validationSubscriptionUser: (req, res, next) => {
    if (Object.values(Packages).includes(req.body.subscription)) {
      return validate(schemaSubscriptionUser, req.body, next);
    }
    return res.status(BAD_REQUEST).json({
      status: 'error',
      code: BAD_REQUEST,
      message: 'Missing required name field',
    });
  },
  validationVerificationEmail: (req, res, next) => {
    if ('email' in req.body) {
      return validate(shemaVerifyEmail, req.body, next);
    }
    return res.status(BAD_REQUEST).json({
      status: 'error',
      code: BAD_REQUEST,
      message: 'Missing required field email',
    });
  },
};

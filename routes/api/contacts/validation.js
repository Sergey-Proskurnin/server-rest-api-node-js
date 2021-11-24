const Joi = require('joi');
const mongoose = require('mongoose');
const {
  HttpCode: { BAD_REQUEST },
  validate,
} = require('../../../helpers');

const schemaCreateContact = Joi.object({
  name: Joi.string()
    .pattern(/^[a-zA-Z' '\-()0-9]{3,30}$/)
    .required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: false }).required(),
  number: Joi.string()
    .pattern(/^[' '\-()0-9]{3,30}$/)
    .required(),
  favorite: Joi.boolean().optional(),
  avatar: Joi.string().optional(),
});

const schemaUpdateContact = Joi.object({
  name: Joi.string()
    .pattern(/^[a-zA-Z' '\-()0-9]{3,30}$/)
    .optional(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: false }).optional(),
  number: Joi.string()
    .pattern(/^[' '\-()0-9]{3,30}$/)
    .optional(),
  avatar: Joi.string().optional(),
}).or('name', 'email', 'number', 'avatar');

const schemaUpdateStatusContact = Joi.object({
  favorite: Joi.boolean().required(),
});
module.exports = {
  validationCreateContact: (req, res, next) => {
    if ('name' in req.body && 'email' in req.body && 'number' in req.body) {
      return validate(schemaCreateContact, req.body, next);
    }
    return res.status(BAD_REQUEST).json({
      status: 'error',
      code: BAD_REQUEST,
      message: 'Missing required name field',
    });
  },
  validationUpdateContact: (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
      return res.status(BAD_REQUEST).json({
        status: 'error',
        code: BAD_REQUEST,
        message: 'Missing fields',
      });
    }
    return validate(schemaUpdateContact, req.body, next);
  },
  validationUpdateStatusContact: (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
      return res.status(BAD_REQUEST).json({
        status: 'error',
        code: BAD_REQUEST,
        message: 'Missing field favorite',
      });
    }
    return validate(schemaUpdateStatusContact, req.body, next);
  },

  validateMongoId: (req, _res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.contactId)) {
      return next({
        status: BAD_REQUEST,
        message: 'Invalid ObjectId',
      });
    }
    next();
  },
};

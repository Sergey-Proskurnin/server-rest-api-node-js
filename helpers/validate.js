const {
  HttpCode: { BAD_REQUEST },
} = require('./constants');
const validate = async (schema, obj, next) => {
  try {
    await schema.validateAsync(obj);
    next();
  } catch (err) {
    next({
      status: BAD_REQUEST,
      message: err.message,
    });
  }
};
module.exports = validate;

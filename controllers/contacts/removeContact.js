const Contacts = require('../../repositories/contacts');
const {
  HttpCode: { OK, NOT_FOUND },
} = require('../../helpers');

const removeContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.removeContact(userId, req.params.contactId);
    if (contact) {
      return res.status(OK).json({
        status: 'success',
        code: OK,
        message: 'Contact deleted',
        data: { contact },
      });
    }
    return res
      .status(NOT_FOUND)
      .json({ status: 'error', code: NOT_FOUND, message: 'Not found' });
  } catch (error) {
    next(error);
  }
};

module.exports = removeContact;

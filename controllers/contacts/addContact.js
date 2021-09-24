const Contacts = require('../../repositories/contacts');
const {
  HttpCode: { CREATED },
} = require('../../helpers');

const addContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contacts = await Contacts.addContact(userId, req.body);
    return res
      .status(CREATED)
      .json({ status: 'success', code: CREATED, data: { contacts } });
  } catch (error) {
    next(error);
  }
};

module.exports = addContact;

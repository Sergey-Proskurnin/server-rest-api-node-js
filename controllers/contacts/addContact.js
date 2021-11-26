require('dotenv').config();
const Contacts = require('../../repositories/contacts');

const {
  HttpCode: { CREATED, OK },
} = require('../../helpers');

const addContacts = async (req, res, next) => {
  try {
    const userId = req.user._id;
    if (req.file === undefined) {
      const contact = await Contacts.addContact(userId, req.body);
      res.status(OK).json({
        status: 'success',
        code: CREATED,
        data: { contact },
      });
    }

    const contact = await Contacts.addAvatarContact(
      userId,
      req.body,
      req.file.path,
    );
    res.status(OK).json({
      status: 'success',
      code: CREATED,
      data: { contact },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = addContacts;

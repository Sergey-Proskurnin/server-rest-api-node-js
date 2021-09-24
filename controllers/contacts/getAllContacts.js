const Contacts = require('../../repositories/contacts');

const {
  HttpCode: { OK },
} = require('../../helpers');

const getAllContacts = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { docs: contacts, ...rest } = await Contacts.listContacts(
      userId,
      req.query,
    );
    return res.status(OK).json({
      status: 'success',
      code: OK,
      data: {
        contacts,
        ...rest,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getAllContacts;

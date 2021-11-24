const getAllContacts = require('./getAllContacts');
const getByIdContact = require('./getByIdContact');
const addContact = require('./addContact');
const updateContact = require('./updateContact');
const removeContact = require('./removeContact');
const updateStatusContact = require('./updateStatusContact');

module.exports = {
  getAllContacts,
  getByIdContact,
  addContact,
  updateContact,
  removeContact,
  updateStatusContact,
};

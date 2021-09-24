const express = require('express');
const router = express.Router();

const guard = require('../../../helpers/guard');

const {
  validationCreateContact,
  validationUpdateContact,
  validationUpdateStatusContact,
  validateMongoId,
} = require('./validation');
const { contacts: ctrl } = require('../../../controllers');

router.get('/', guard, ctrl.getAllContacts);

router.get('/:contactId', guard, validateMongoId, ctrl.getByIdContact);

router.post('/', guard, validationCreateContact, ctrl.addContact);

router.delete('/:contactId', guard, validateMongoId, ctrl.removeContact);

router.put(
  '/:contactId',
  guard,
  validateMongoId,
  validationUpdateContact,
  ctrl.updateContact,
);

router.patch(
  '/:contactId/favorite',
  guard,
  validateMongoId,
  validationUpdateStatusContact,
  ctrl.updateStatusContact,
);

module.exports = router;

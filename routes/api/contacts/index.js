const express = require('express');
const router = express.Router();
const { upload } = require('../../../helpers');

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

router.post(
  '/',
  guard,
  upload.single('avatar'),
  validationCreateContact,
  ctrl.addContact,
);

router.delete('/:contactId', guard, validateMongoId, ctrl.removeContact);

router.put(
  '/:contactId',
  guard,
  upload.single('avatar'),
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

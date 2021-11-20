require('dotenv').config();
const fs = require('fs/promises');
const Contacts = require('../../repositories/contacts');

const {
  HttpCode: { CREATED, OK },
} = require('../../helpers');
const { UploadService } = require('../../services');

const addAvatarsContacts = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const uploads = new UploadService();
    if (req.file === undefined) {
      const contact = await Contacts.addContact(userId, req.body);
      res.status(OK).json({
        status: 'success',
        code: CREATED,
        data: { contact },
      });
    }
    const { idCloudAvatar, avatarUrl } = await uploads.saveAvatarContact(
      req.file.path,
      null,
    );
    try {
      await fs.unlink(req.file.path);
    } catch (error) {
      console.log(error.message);
    }
    const contact = await Contacts.addAvatarContact(
      userId,
      req.body,
      idCloudAvatar,
      avatarUrl,
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

module.exports = addAvatarsContacts;

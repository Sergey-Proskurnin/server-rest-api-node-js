const Users = require('../../repositories/users');
require('dotenv').config();
const fs = require('fs/promises');
const path = require('path');

const {
  HttpCode: { OK },
} = require('../../helpers');
const { UploadAvatarService } = require('../../services');

const avatars = async (req, res, next) => {
  try {
    const id = req.user.id;
    const uploads = new UploadAvatarService(process.env.AVATAR_OF_USERS);
    const avatarUrl = await uploads.saveAvatar({ idUser: id, file: req.file });
    try {
      await fs.unlink(
        path.join(process.env.AVATAR_OF_USERS, req.user.avatarURL),
      );
    } catch (error) {
      console.log(error.message);
    }
    await Users.updateAvatar(id, avatarUrl);
    res.status(OK).json({
      status: 'success',
      code: OK,
      data: { avatarURL: avatarUrl },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = avatars;

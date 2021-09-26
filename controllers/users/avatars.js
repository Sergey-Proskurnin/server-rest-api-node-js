const Users = require('../../repositories/users');
require('dotenv').config();
const fs = require('fs/promises');

const {
  HttpCode: { OK },
} = require('../../helpers');
const { UploadService } = require('../../services');

const avatars = async (req, res, next) => {
  try {
    const id = req.user.id;
    const uploads = new UploadService();
    const { idCloudAvatar, avatarUrl } = await uploads.saveAvatar(
      req.file.path,
      req.user.idCloudAvatar,
    );
    try {
      await fs.unlink(
        req.file.path,
      );
    } catch (error) {
      console.log(error.message);
    }
    await Users.updateAvatar(id, avatarUrl, idCloudAvatar);
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

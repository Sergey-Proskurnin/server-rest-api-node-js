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
    const { name } = req.body;
    const uploads = new UploadService();
    if (req.file === undefined) {
      const updatedUser = await Users.updateUserName(id, name);
      res.status(OK).json({
        status: 'success',
        code: OK,
        data: {
          user: {
            name: updatedUser.name,
            email: updatedUser.email,
            avatarURL: updatedUser.avatarURL,
          },
        },
      });
    }

    const { idCloudAvatar, avatarUrl } = await uploads.saveAvatar(
      req.file.path,
      req.user.idCloudAvatar,
    );
    try {
      await fs.unlink(req.file.path);
    } catch (error) {
      console.log(error.message);
    }
    const updatedUser = await Users.updateUserInfo(
      id,
      avatarUrl,
      idCloudAvatar,
      name,
    );
    res.status(OK).json({
      status: 'success',
      code: OK,
      data: {
        user: {
          name: updatedUser.name,
          email: updatedUser.email,
          avatarURL: updatedUser.avatarURL,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = avatars;

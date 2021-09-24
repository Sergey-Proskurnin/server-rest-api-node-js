const Jimp = require('jimp');
const { createFolderIsNotExist } = require('../helpers');
const path = require('path');
const fs = require('fs/promises');

class UploadAvatarService {
  constructor(folderAvatars) {
    this.folderAvatars = folderAvatars;
  }

  async transformAvatars(pathFile) {
    const pic = await Jimp.read(pathFile);
    await pic
      .autocrop()
      .cover(
        250,
        250,
        Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE,
      )
      .writeAsync(pathFile);
  }

  async saveAvatar({ idUser, file }) {
    await this.transformAvatars(file.path);
    const folderUserAvatar = path.join(this.folderAvatars, idUser);
    await createFolderIsNotExist(folderUserAvatar);
    await fs.rename(file.path, path.join(folderUserAvatar, file.filename));
    return path.normalize(path.join(idUser, file.filename));
  }
}

module.exports = UploadAvatarService;

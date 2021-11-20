const cloudinary = require('cloudinary').v2;
const { promisify } = require('util');
const Jimp = require('jimp');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});
const uploadCloud = promisify(cloudinary.uploader.upload);

class UploadService {
  /** Transform avatars into jimp */
  async transformAvatars(pathFile) {
    const pic = await Jimp.read(pathFile);
    await pic
      .autocrop()
      .cover(
        250,
        250,
        Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE,
      )
      .circle({ radius: 120 })
      .background(0xffffffff)
      .writeAsync(pathFile);
  }

  async saveAvatar(pathFile, oldIdCloudAvatar) {
    await this.transformAvatars(pathFile);
    const { public_id: idCloudAvatar, secure_url: avatarUrl } =
      await uploadCloud(pathFile, {
        public_id: oldIdCloudAvatar?.replace('CloudAvatars/', ''),
        folder: 'CloudAvatars',
        /** Transform avatars into cloudinary */
        // transformation: {width: 250, height: 250, crop: "fill"},
      });
    return { idCloudAvatar, avatarUrl };
  }

  async saveAvatarContact(pathFileContact, oldIdCloudAvatarContact) {
    await this.transformAvatars(pathFileContact);
    const { public_id: idCloudAvatar, secure_url: avatarUrl } =
      await uploadCloud(pathFileContact, {
        public_id: oldIdCloudAvatarContact?.replace(
          'CloudAvatarsContacts/',
          '',
        ),
        folder: 'CloudAvatarsContacts',
        /** Transform avatars into cloudinary */
        // transformation: {width: 250, height: 250, crop: "fill"},
      });
    return { idCloudAvatar, avatarUrl };
  }
}
module.exports = UploadService;

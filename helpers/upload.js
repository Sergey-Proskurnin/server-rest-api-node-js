const multer = require('multer');
const { v4: uuid } = require('uuid');

const {
  HttpCode: { BAD_REQUEST },
} = require('./constants');

require('dotenv').config();
const UPLOAD_DIR = process.env.UPLOAD_DIR;

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (_req, file, cb) {
    cb(null, `${uuid()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.includes('image')) {
      cb(null, true);
      return;
    }
    const error = new Error('Wrong format file for avatar');
    error.status = BAD_REQUEST;
    cb(error);
  },
});

module.exports = upload;

const { Schema, model } = require('mongoose');
const { Packages } = require('../helpers');
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');

const SALT_WORK_FACTOR = 10;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      min: 3,
      max: 30,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      validate(value) {
        const re = /\S+@\S+\.\S+/g;
        return re.test(String(value).toLowerCase());
      },
    },
    subscription: {
      type: String,
      enum: Object.values(Packages),
      default: 'starter',
    },
    token: {
      type: String,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
      default: null,
    },
    idCloudAvatar: { type: String, default: null },
    verify: { type: Boolean, default: false },
    verifyToken: {
      type: String,
      require: [true, 'Verify token is required'],
      default: uuid(),
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = model('user', userSchema);

module.exports = User;

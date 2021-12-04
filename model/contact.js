const { Schema, model, SchemaTypes } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      min: 3,
      max: 30,
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
    number: {
      type: String,
      required: [true, 'Number is required'],
      min: 3,
      max: 30,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    idCloudAvatarContact: { type: String, default: null },
    owner: { type: SchemaTypes.ObjectId, ref: 'user' },
    avatarContactURL: {
      type: String,
      default: null,
    },
  },

  {
    versionKey: false,
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret) {
        delete ret._id;
        return ret;
      },
    },
    toObject: {},
  },
);
contactSchema.plugin(mongoosePaginate);
const Contact = model('contact', contactSchema);

module.exports = Contact;

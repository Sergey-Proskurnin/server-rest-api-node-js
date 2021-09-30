const { Schema, model, SchemaTypes } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const contactSchema = new Schema(
  {
    name: {
      type: String,
      min: 3,
      max: 30,
    },
    email: String,
    number: {
      type: String,
      min: 3,
      max: 30,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: { type: SchemaTypes.ObjectId, ref: 'user' },
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

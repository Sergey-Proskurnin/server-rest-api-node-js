const { Schema, model, SchemaTypes } = require('mongoose');

const sessionShema = new Schema(
  {
    uid: { type: SchemaTypes.ObjectId },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

const Session = model('Session', sessionShema);

module.exports = Session;

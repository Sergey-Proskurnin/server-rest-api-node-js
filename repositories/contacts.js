const Contact = require('../model/contact');
const { UploadService } = require('../services');
const fs = require('fs/promises');

const listContacts = async (userId, query) => {
  const {
    limit = 100,
    page = 1,
    sortBy,
    sortByDesc,
    filter,
    favorite = null,
  } = query;
  const optionsSearch = { owner: userId };
  if (favorite !== null) {
    optionsSearch.favorite = favorite;
  }
  const result = Contact.paginate(optionsSearch, {
    limit,
    page,
    sort: {
      ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
      ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}),
    },
    select: filter ? filter.split('|').join(' ') : '',
    populate: {
      path: 'owner',
      select: 'email subscription -_id',
    },
  });
  return result;
};

const getContactById = async (userId, contactId) => {
  const result = await Contact.findOne({
    _id: contactId,
    owner: userId,
  }).populate({
    path: 'owner',
    select: 'email subscription -_id',
  });
  return result;
};

const removeContact = async (userId, contactId) => {
  const uploads = new UploadService();
  const { idCloudAvatarContact } = await Contact.findOne({
    _id: contactId,
    owner: userId,
  });
  if (idCloudAvatarContact === null) {
    const result = await Contact.findOneAndRemove({
      _id: contactId,
      owner: userId,
    });
    return result;
  }
  const result = await uploads.deleteAvatar(idCloudAvatarContact);
  if (result === 'ok') {
    const result = await Contact.findOneAndRemove({
      _id: contactId,
      owner: userId,
    });
    return result;
  }
  throw new Error(`Server ${result}`);
};

const addContact = async (userId, body) => {
  const result = await Contact.create({ ...body, owner: userId });
  return result;
};

const addAvatarContact = async (userId, body, idCloudAvatar, avatarUrl) => {
  const result = await Contact.create({
    ...body,
    owner: userId,
    idCloudAvatarContact: idCloudAvatar,
    avatarContactURL: avatarUrl,
  });
  return result;
};

const updateContact = async (userId, contactId, body) => {
  const result = await Contact.findOneAndUpdate(
    { _id: contactId, owner: userId },
    { ...body },
    { upsert: true, returnDocument: 'after' },
  );
  return result;
};

const updateAvatarContact = async (userId, contactId, body, path) => {
  const uploads = new UploadService();
  const { idCloudAvatarContact } = await Contact.findOne({
    _id: contactId,
    owner: userId,
  });
  const { idCloudAvatar, avatarUrl } = await uploads.saveAvatarContact(
    path,
    idCloudAvatarContact,
  );
  try {
    await fs.unlink(path);
  } catch (error) {
    console.log(error.message);
  }
  const result = await Contact.findOneAndUpdate(
    { _id: contactId, owner: userId },
    {
      ...body,
      idCloudAvatarContact: idCloudAvatar,
      avatarContactURL: avatarUrl,
    },
    { upsert: true, returnDocument: 'after' },
  );
  return result;
};

const updateStatusContact = async (userId, contactId, body) => {
  const result = await Contact.findOneAndUpdate(
    { _id: contactId, owner: userId },
    { favorite: body },
    { returnDocument: 'after' },
  );
  return result;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
  addAvatarContact,
  updateAvatarContact,
};

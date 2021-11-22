const Contact = require('../model/contact');

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
  const result = await Contact.findOneAndRemove({
    _id: contactId,
    owner: userId,
  });
  return result;
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
};

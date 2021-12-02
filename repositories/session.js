const Session = require('../model/session');

const create = async id => {
  const session = await Session.create({ uid: id });
  return session;
};

const addSession = async sid => await Session.findById(sid);

const removeSession = async (sid, userId) =>
  await Session.findOneAndRemove({
    _id: sid,
    uid: userId,
  });

module.exports = {
  create,
  addSession,
  removeSession,
};

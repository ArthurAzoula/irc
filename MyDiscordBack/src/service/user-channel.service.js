const Sequelize = require("sequelize");
const database = require("../db/models/index");
const { Op } = require("sequelize");

const getUserChannels = async ({ limit, offset }) => {
  const userChannels = await database.sequelize.models.userChannel.findAll({
    limit,
    offset,
  });
  return userChannels;
};

const getUserChannelByUserIdAndChannelId = async (userId, channelId) => {
  const userChannel = await database.sequelize.models.userChannel.findOne({
    where: {
      [Op.or]: [{ idAccount: userId }, { idAnonymous: userId }],
      idChannel: channelId,
    },
  });
  return userChannel;
};

const getUserChannelById = async (userChannelId) => {
  const userChannel = await database.sequelize.models.userChannel.findByPk(
    userChannelId
  );
  return userChannel;
};

const getAllUserChannelsByUserId = async (userId) => {
  const userChannels = await database.sequelize.models.userChannel.findAll({
    where: {
      [Op.or]: [{ idAccount: userId }, { idAnonymous: userId }],
    },
  });
  return userChannels;
};

const getAllChannelsByUserId = async (channelId, {type}) => {
  
  const userChannels = await getAllUserChannelsByUserId(channelId);

  const where = {};

  if (type && type.includes("all")) {
    delete where.category;
  } else {
    where.category = type;
  }

  const ids = [];

  userChannels.forEach((userChannel) => {
    ids.push(userChannel.dataValues.idChannel);
  });

  where.id = ids;

  const channels = await database.sequelize.models.channel.findAll({
    where,
  });
  
  return channels;
};

const getAllUserChannelsByChannelId = async (channelId) => {
  const userChannels = await database.sequelize.models.userChannel.findAll({
    where: { idChannel: channelId },
  });

  return userChannels;
};

const createUserChannel = async (userChannelData) => {
  const userChannel = await database.sequelize.models.userChannel.create(
    userChannelData
  );
  return userChannel;
};

const updateUserChannel = async (userChannelId, updatedData) => {
  const [updatedRowsCount] = await database.sequelize.models.userChannel.update(
    updatedData,
    {
      where: { id: userChannelId },
    }
  );

  if (updatedRowsCount > 0) {
    const updatedUserChannel =
      await database.sequelize.models.userChannel.findByPk(userChannelId);
    return updatedUserChannel;
  }

  return null;
};

const deleteUserChannel = async (userChannelId) => {
  const deletedRowsCount = await database.sequelize.models.userChannel.destroy({
    where: { id: userChannelId },
  });

  return deletedRowsCount > 0;
};

const updateUserNickname = async (userChannelId, nickname) => {
  const [updatedRowsCount] = await database.sequelize.models.userChannel.update(
    { nickname },
    {
      where: { id: userChannelId },
    }
  );

  if (updatedRowsCount > 0) {
    const updatedUserChannel =
      await database.sequelize.models.userChannel.findByPk(userChannelId);
    return updatedUserChannel;
  }

  return null;
};

const getUserChannelByNickname = async (nickname, idChannel) => {
  const userChannel = await database.sequelize.models.userChannel.findOne({
    where: { nickname, idChannel },
  });
  return userChannel;
};

module.exports = {
  getUserChannels,
  getUserChannelById,
  getAllUserChannelsByUserId,
  getAllUserChannelsByChannelId,
  getAllChannelsByUserId,
  createUserChannel,
  updateUserChannel,
  deleteUserChannel,
  updateUserNickname,
  getUserChannelByUserIdAndChannelId,
  getUserChannelByNickname,
};

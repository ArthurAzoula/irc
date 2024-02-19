const database = require("../db/models/index");
const { Op } = require("sequelize");

const getChannels = async ({ limit, offset, type, channelName }) => {
  const where = {};
  const include = [];

  include.push({
    model: database.sequelize.models.userChannel,
    as: "userChannel",
  });

  if (type && type.includes("all")) {
    delete where.category;
  } else {
    where.category = type;
  }

  if (channelName) {
    where.name = {
      [Op.iLike]: `%${channelName}%`,
    }
  }

  const channels = await database.sequelize.models.channel.findAll({
    limit,
    offset,
    where,
    include,
    order: [["createdAt", "DESC"]],
  });

  return channels;
};

const getChannelByName = async (channelName, public = false) => {

  if (public) {
    const channel = await database.sequelize.models.channel.findOne({
      where: { 
        name: { [Op.iLike]: channelName },
        category: "public" },
    });

    return channel;
  } else {
    const channel = await database.sequelize.models.channel.findOne({
      where: { name: { [Op.iLike]: channelName } },
    });
    return channel;
  }
}

const getMessagesByChannelId = async (channelId, { limit, offset }) => {
  const messages = await database.sequelize.models.message.findAll({
    limit,
    offset,
    include: [
      {
        model: database.sequelize.models.userChannel,
        as: "userChannel",
        include: [
          {
            model: database.sequelize.models.account,
            as: "account",
            attributes: { exclude : ['password'] },
          }
          
        ]
      },
    ],
    where: { idChannel: channelId },
    order: [["createdAt", "ASC"]],
  });

  return messages;
};

const getChannelById = async (channelId) => {
  const channel = await database.sequelize.models.channel.findByPk(channelId);
  return channel;
};

const createChannel = async (channelData) => {
  const channel = await database.sequelize.models.channel.create(channelData);
  return channel;
};

const updateChannel = async (channelId, updatedData) => {
  const [updatedRowsCount] = await database.sequelize.models.channel.update(
    updatedData,
    {
      where: { id: channelId },
    }
  );
  
  if (updatedRowsCount > 0) {
    const updatedChannel = await database.sequelize.models.channel.findByPk(
      channelId
    );
    
    return updatedChannel;
  }

  return null;
};

const deleteChannel = async (channelId) => {
  await database.sequelize.models.userChannel.destroy({
    where: { idChannel: channelId },
  });

  const deletedRowsCount = await database.sequelize.models.channel.destroy({
    where: { id: channelId },
  });

  return deletedRowsCount > 0;
};

module.exports = {
  getChannels,
  getChannelById,
  getChannelByName,
  getMessagesByChannelId,
  createChannel,
  updateChannel,
  deleteChannel,
};

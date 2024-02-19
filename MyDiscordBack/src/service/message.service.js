const database = require("../db/models/index");

const getMessages = async ({ limit, offset }) => {
  const messages = await database.sequelize.models.message.findAll({
    limit,
    offset,
  });
  return messages;
};

const getMessageById = async (messageId) => {
  const message = await database.sequelize.models.message.findByPk(messageId);
  return message;
};

const createMessage = async (messageData) => {
  const message = await database.sequelize.models.message.create(messageData);
  return message;
};

const updateMessage = async (messageId, updatedData) => {
  const [updatedRowsCount] = await database.sequelize.models.message.update(
    updatedData,
    {
      where: { id: messageId },
    }
  );

  if (updatedRowsCount > 0) {
    const updatedMessage = await database.sequelize.models.message.findByPk(
      messageId
    );
    return updatedMessage;
  }

  return null;
};

const deleteMessage = async (messageId) => {
  const deletedRowsCount = await database.sequelize.models.message.destroy({
    where: { id: messageId },
  });

  return deletedRowsCount > 0;
};

module.exports = {
  getMessages,
  getMessageById,
  createMessage,
  updateMessage,
  deleteMessage,
};

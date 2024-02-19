const Joi = require('joi');
const { getAllUserChannelsByChannelId } = require('../service/user-channel.service');

const registerListUsersEvent = (io, socket) => {
  socket.on('users', content => listUsers(io, socket, content));
}

const listUsers = async (io, socket, content) => {
  if (!socket.user.connected) {
    socket.emit('users', {
      error: 'You are not connected'
    });
    return;
  }

  const validationSchema = Joi.object({
    channelId: Joi.string().uuid().required(),
  });

  const { value, error } = validationSchema.validate(content);
  if (error) {
    socket.emit('users', {
      error: error.message
    });
    return;
  }

  const { channelId } = value;

  const usersInChannel = await getAllUserChannelsByChannelId(channelId);

  if (usersInChannel) {
    const nicknames = usersInChannel.map(user => user.nickname);
    socket.emit('users', {
      users: nicknames
    });
    return;
  }

  socket.emit('users', {
    error: 'Failed to fetch user list'
  });
}

module.exports = registerListUsersEvent;

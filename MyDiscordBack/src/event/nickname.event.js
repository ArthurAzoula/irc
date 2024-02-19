const Joi = require('joi');
const { updateUserNickname } = require('../service/user-channel.service');
const { getUserChannelByUserIdAndChannelId } = require('../service/user-channel.service');

const registerNicknameChangedEvent = (io, socket) => {
  socket.on('nicknameChanged', content => nicknameChanged(io, socket, content));
}

const nicknameChanged = async (io, socket, content) => {
  if (!socket.user.connected) {
    socket.emit('nicknameChanged', {
      error: 'You are not connected'
    });
    
    return;
  }

  const validationSchema = Joi.object({
    channelId: Joi.string().uuid().required(),
    message: Joi.string().min(1).required(),
  });

  const { value, error } = validationSchema.validate(content);
  if (error) {
    socket.emit('nicknameChanged', {
      error: error.message
    });

    return;
  }

  const { channelId, message } = value;

  // get the userChannel by channelId and userId

  const userChannel = await getUserChannelByUserIdAndChannelId(socket.user.id, channelId);

  const updated = await updateUserNickname(userChannel.id, message);

  if (updated) {
    io.to(channelId).emit('nicknameChanged', `L'utilisateur ${socket.user.nickname} a changé son pseudo en ${message}`);
    return;
  }

  socket.emit('nicknameChanged', {
    error: 'Nickname not updated'
  });
}

module.exports = registerNicknameChangedEvent;

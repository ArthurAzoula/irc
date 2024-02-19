const Joi = require('joi');
const { getChannelById } = require('../service/channel.service');
const { createMessage } = require('../service/message.service');
const { getUserChannelById, getAllUserChannelsByChannelId } = require('../service/user-channel.service');
const Logger = require('../helper/Logger.helper');

const registerMessageEvent = (io, socket) => {
  socket.on('message', content => message(io, socket, content));
}

const message = async (io, socket, content) => {
  if(!socket.user.connected){
    socket.emit('message', {
      error: 'You are not connected'
    });
    
    return;
  }
  
  const validationSchema = Joi.object({
    message: Joi.string().min(1).required(),
    channelId: Joi.string().uuid().required(),
  });
  
  const { value, error } = validationSchema.validate(content);
  if(error){
    socket.emit('message', {
      error: error.message
    });
    
    return;
  }
  
  const channel = await getChannelById(value.channelId);
  
  if(!channel){
    socket.emit('message', {
      error: 'No channel found'
    });
    
    return;
  }

  const userChannelByChannelId = await getAllUserChannelsByChannelId(channel.id);

  if(!userChannelByChannelId) {
    socket.emit('message', {
      error: 'No user channel found'
    })
  }

  const userChannel = userChannelByChannelId.filter((u) => (u.idAccount || u.idAnonymous) == socket.user.id)

  if (!userChannel) {
    socket.emit('message', {
      error: 'No user found'
    })
  }

  value.message = value.message.trim().clearBadWords();
  
  if(!io.sockets.adapter.rooms.has(channel.id)){
    socket.emit('message', {
      error: 'No channel found in socket'
    });
    
    return;
  }
  
  const message = await createMessage({
    "idUserChannel" : userChannel[0].id,
    "idChannel" : channel.id,
    "content" : value.message,
    "image" : null,
  })
  
  value.createdAt = message.createdAt;
  value.userChannel = {...userChannel[0].dataValues};
  value.userChannel.account = socket.user;


  if (message) {
    io.to(channel.id).emit('message', value);
    return;
  }

  socket.emit('message', {
    error: 'Message not created'
  });

}

module.exports = registerMessageEvent;
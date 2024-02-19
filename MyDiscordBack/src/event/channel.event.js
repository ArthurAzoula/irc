const Joi = require("joi");
const channelService = require("../service/channel.service");
const userChannelService = require("../service/user-channel.service");
const messageService = require("../service/message.service");

const registerChannelEvent = (io, socket, content) => {
  socket.on("deleteChannel", (content) => deleteChannel(io, socket, content));
  socket.on("joinChannel", (content) => joinChannel(io, socket, content));
  socket.on("leaveChannel", (content) => leaveChannel(io, socket, content));
  socket.on("listChannels", (content) => listChannels(io, socket, content));
  socket.on("createChannel", (content) => createChannel(io, socket, content));
  socket.on("sendPrivateMessage", (content) =>
    sendPrivateMessage(io, socket, content)
  );
};

const deleteChannel = async (io, socket, content) => {
  if (!socket.user.connected) {
    socket.emit("deleteChannel", {
      error: "You are not connected",
    });

    return;
  }

  const validationSchema = Joi.object({
    name: Joi.string().required(),
  });

  const { value, error } = validationSchema.validate(content);
  if (error) {
    socket.emit("deleteChannel", {
      error: error.message,
    });

    return;
  }

  const channel = await channelService.getChannelByName(value.name, true);

  if (!channel) {
    socket.emit("deleteChannel", {
      error: "No channel found",
    });

    return;
  }

  const userChannel =
    await userChannelService.getUserChannelByUserIdAndChannelId(
      socket.user.id,
      channel.id
    );

  if (!userChannel) {
    socket.emit("deleteChannel", {
      error: "No user channel found",
    });

    return;
  }

  if (userChannel.isAdmin) {
    const deleted = await channelService.deleteChannel(channel.id);

    if (deleted) {
      io.to(channel.id).emit("deleteChannel", {
        message: `Le channel ${channel.name} a été supprimé`,
      });

      return;
    }
  } else {
    socket.emit("deleteChannel", {
      error: "Vous n'êtes pas administrateur de ce channel",
    });

    return;
  }

  socket.emit("deleteChannel", {
    error: "Failed to delete channel",
  });

  return;
};

const joinChannel = async (io, socket, content) => {
  if (!socket.user.connected) {
    socket.emit("joinChannel", {
      error: "You are not connected",
    });

    return;
  }

  const validationSchema = Joi.object({
    name: Joi.string().required(),
  });

  const { value, error } = validationSchema.validate(content);
  if (error) {
    socket.emit("joinChannel", {
      error: error.message,
    });

    return;
  }

  const channel = await channelService.getChannelByName(value.name, true);

  if (!channel) {
    socket.emit("joinChannel", {
      error: "No channel found",
    });

    return;
  }

  const userChannelAlreadyInChannel =
    await userChannelService.getUserChannelByUserIdAndChannelId(
      socket.user.id,
      channel.id
    );

  if (userChannelAlreadyInChannel) {
    socket.emit("joinChannel", {
      error: "Vous avez déjà rejoint ce channel",
    });

    return;
  }

  const userChannel = await userChannelService.createUserChannel({
    idChannel: channel.id,
    idAccount: socket.user.isAnonymous ? null : socket.user.id,
    idAnonymous: socket.user.isAnonymous ? socket.user.id : null,
    nickname: socket.user.nickname,
  });

  if (userChannel) {
    io.to(channel.id).emit("joinChannel", {
      message: `L'utilisateur ${socket.user.nickname} a rejoint le channel ${channel.name}`,
      userChannel: userChannel,
      channel: channel,
    });

    socket.join(channel.id);

    return;
  }

  socket.emit("joinChannel", {
    error: "Failed to join channel",
  });
};

const leaveChannel = async (io, socket, content) => {
  if (!socket.user.connected) {
    socket.emit("leaveChannel", {
      error: "You are not connected",
    });

    return;
  }

  const validationSchema = Joi.object({
    name: Joi.string().required(),
  });

  const { value, error } = validationSchema.validate(content);
  if (error) {
    socket.emit("leaveChannel", {
      error: error.message,
    });

    return;
  }

  const channel = await channelService.getChannelByName(value.name);

  if (!channel) {
    socket.emit("leaveChannel", {
      error: "No channel found",
    });

    return;
  }

  if (!io.sockets.adapter.rooms.has(channel.id)) {
    socket.emit("leaveChannel", {
      error: "No channel found",
    });

    return;
  }

  const userChannel =
    await userChannelService.getUserChannelByUserIdAndChannelId(
      socket.user.id,
      channel.id
    );

  if (!userChannel) {
    socket.emit("leaveChannel", {
      error: "No user channel found",
    });

    return;
  }

  const deleted = await userChannelService.deleteUserChannel(userChannel.id);

  if (deleted) {
    io.to(channel.id).emit("leaveChannel", {
      message: `L'utilisateur ${socket.user.nickname} a quitté le channel ${channel.name}`,
    });

    socket.leave(channel.id);

    return;
  }

  socket.emit("leaveChannel", {
    error: "Failed to leave channel",
  });
};

const listChannels = async (io, socket, content) => {
  if (!socket.user.connected) {
    socket.emit("listChannels", {
      error: "You are not connected",
    });

    return;
  }

  // channel name can be empty
  const validationSchema = Joi.object({
    channelName: Joi.string().allow(""),
  });

  const { value, error } = validationSchema.validate(content);
  if (error) {
    socket.emit("listChannels", {
      error: error.message,
    });

    return;
  }

  let channels;

  if (value.channelName == "") {
    channels = await channelService.getChannels({
      type: ["public"],
    });
  } else {
    channels = await channelService.getChannels({
      type: ["public"],
      channelName: value.channelName,
    });
  }

  if (channels) {
    socket.emit("listChannels", {
      channels: channels,
    });
    return;
  }

  socket.emit("listChannels", {
    error: "Failed to fetch channel list",
  });
};

const createChannel = async (io, socket, content) => {
  if (!socket.user.connected) {
    socket.emit("createChannel", {
      error: "You are not connected",
    });

    return;
  }

  const validationSchema = Joi.object({
    name: Joi.string().min(1).required(),
    category: Joi.string().valid("public", "private", "group").required(),
  });

  const { value, error } = validationSchema.validate(content);
  if (error) {
    socket.emit("createChannel", {
      error: error.message,
    });

    return;
  }

  const channel = await channelService.createChannel(value);

  const userChannel = await userChannelService.createUserChannel({
    idChannel: channel.id,
    idAccount: socket.user.isAnonymous ? null : socket.user.id,
    idAnonymous: socket.user.isAnonymous ? socket.user.id : null,
    nickname: socket.user.nickname,
    isAdmin: true,
  });

  if (channel) {
    socket.emit("createChannel", {
      channel: channel,
      userChannel: userChannel,
    });
    return;
  }

  socket.emit("createChannel", {
    error: "Failed to create channel",
  });
};

const sendPrivateMessage = async (io, socket, content) => {
  if (!socket.user.connected) {
    socket.emit("sendPrivateMessage", {
      error: "You are not connected",
    });

    return;
  }

  const validationSchema = Joi.object({
    nickname: Joi.string().required(),
    message: Joi.string().required(),
    idChannel: Joi.string().uuid().required(),
  });

  const { value, error } = validationSchema.validate(content);
  if (error) {
    socket.emit("sendPrivateMessage", {
      error: error.message,
    });

    return;
  }

  const user = await userChannelService.getUserChannelByNickname(
    value.nickname,
    value.idChannel
  );

  if (!user) {
    socket.emit("sendPrivateMessage", {
      error: "No user found",
    });

    return;
  }

  if (user.idChannel !== value.idChannel) {
    socket.emit("sendPrivateMessage", {
      error: "Le destinataire n'est pas présent dans ce channel",
    });

    return;
  }

  const privateChannel = await channelService.createChannel({
    name: `${socket.user.nickname}-${user.nickname}`,
    category: "private",
  });

  let meUserChannel;
  let userUserChannel;

  // check isAnonymous
  if (socket.user.isAnonymous) {
    meUserChannel = await userChannelService.createUserChannel({
      idChannel: privateChannel.id,
      idAnonymous: socket.user.id,
      nickname: socket.user.nickname,
    });
  } else {
    meUserChannel = await userChannelService.createUserChannel({
      idChannel: privateChannel.id,
      idAccount: socket.user.id,
      nickname: socket.user.nickname,
    });
  }

  if (user.isAnonymous) {
    userUserChannel = await userChannelService.createUserChannel({
      idChannel: privateChannel.id,
      idAnonymous: user.idAnonymous,
      nickname: user.nickname,
    });
  } else {
    userUserChannel = await userChannelService.createUserChannel({
      idChannel: privateChannel.id,
      idAccount: user.idAccount,
      nickname: user.nickname,
    });
  }

  const message = await messageService.createMessage({
    idUserChannel: meUserChannel.id,
    idChannel: privateChannel.id,
    content: value.message,
    image: null,
  });

  if (message) {
    io.to(privateChannel.id).emit("sendPrivateMessage", {
      message: value.message,
      meUserChannel: meUserChannel,
      userUserChannel: userUserChannel,
    });
    return;
  }
};

module.exports = registerChannelEvent;

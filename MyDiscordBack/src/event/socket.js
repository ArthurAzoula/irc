const registerMessageEvent = require('./message.event');
const registerCommandEvent = require('./command.event');
const registerNicknameChangedEvent = require('./nickname.event');
const registerListUsersEvent = require('./users.event');
const registerChannelEvent = require('./channel.event');
const { getChannels } = require('../service/channel.service');
const cookie = require('cookie');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const account = require('../service/account.service');
const anonymous = require('../service/anonymous.service');
const { getUserChannelById, getAllChannelsByUserId } = require('../service/user-channel.service');
const Logger = require('../helper/Logger.helper');

const initializeSocket = async (io, socket) => {
  await initializeUser(io, socket);
  await intializeChannels(io, socket);
  registerEvents(io, socket);
}

const registerEvents = (io, socket) => {
  registerMessageEvent(io, socket);
  registerChannelEvent(io, socket);
  registerCommandEvent(io, socket);
  registerNicknameChangedEvent(io, socket);
  registerListUsersEvent(io, socket);
}

const initializeUser = async (io, socket) => {
  const cookies = cookie.parse(socket.handshake?.headers?.cookie ?? '');
  
  const token = cookieParser.signedCookie(cookies['token'], process.env.COOKIE_SECRET);
  const user = jwt.verify(token, process.env.JWT_SECRET, (err, user) => err ? null : user);
  
  if(!user){
    socket.user = {
      connected: false
    }
    return;
  }
  
  const userAccount = await account.getAccountById(user.id);
  
  if(userAccount){
    socket.user = userAccount.dataValues;
    socket.user.connected = true;
    return;
  }
  
  const anonymousUser = await anonymous.getAnonymousById(user.id);
  
  if(anonymousUser){
    socket.user = anonymousUser.dataValues;
    socket.user.connected = true;
    socket.user.isAnonymous = true;
    return;
  }
  
  socket.user = {
    connected: false
  }
}

const intializeChannels = async (io, socket) => {
  if(!socket.user?.connected) return;
  
  const channels = await getAllChannelsByUserId(socket.user.id, {type: ['all']});
  
  channels?.forEach(channel => socket.join(channel.id));
}

module.exports = initializeSocket;
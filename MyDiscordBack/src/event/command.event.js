const nickEvent = require('./command/nick.command');
const listEvent = require('./command/list.command');
const createEvent = require('./command/create.command');
const deleteEvent = require('./command/delete.command');
const joinEvent = require('./command/join.command');
const quitEvent = require('./command/quit.command');
const usersEvent = require('./command/users.command');
const messageEvent = require('./command/message.command');

const commands = {
  "nick": nickEvent,
  "list": listEvent,
  "create": createEvent,
  "delete": deleteEvent,
  "join": joinEvent,
  "quit": quitEvent,
  "users": usersEvent,
  "msg": messageEvent,
}

const registerCommandEvent = (data) => {
  for(let command in commands) {
    if(data?.command?.toLowerCase() === command) {
      commands[command](data);
      break;
    }
  }
}

module.exports = registerCommandEvent;
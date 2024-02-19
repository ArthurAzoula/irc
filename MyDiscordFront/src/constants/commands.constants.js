const PREFIX = '/';

const COMMANDS = {
    CHANGE_NICKNAME: `${PREFIX}nick`,
    LIST_USERS: `${PREFIX}users`,
    LIST_CHANNELS: `${PREFIX}list`,
    CREATE_CHANNEL: `${PREFIX}create`,
    DELETE_CHANNEL: `${PREFIX}delete`,
    JOIN_CHANNEL: `${PREFIX}join`,
    LEAVE_CHANNEL: `${PREFIX}quit`,
    SEND_PRIVATE_MESSAGE: `${PREFIX}msg`,
};

export {
    PREFIX,
    COMMANDS,
};


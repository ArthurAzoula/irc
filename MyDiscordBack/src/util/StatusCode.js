const status = require('http-status');

const StatusCode = {
    OK: status.OK,
    CREATED: status.CREATED,
    ACCEPTED: status.ACCEPTED,
    NO_CONTENT: status.NO_CONTENT,
    BAD_REQUEST: status.BAD_REQUEST,
    UNAUTHORIZED: status.UNAUTHORIZED,
    FORBIDDEN: status.FORBIDDEN,
    NOT_FOUND: status.NOT_FOUND,
    CONFLICT: status.CONFLICT,
    INTERNAL_SERVER_ERROR: status.INTERNAL_SERVER_ERROR,
    BAD_GATEWAY: status.BAD_GATEWAY,
    SERVICE_UNAVAILABLE: status.SERVICE_UNAVAILABLE,
    GATEWAY_TIMEOUT: status.GATEWAY_TIMEOUT,
};

module.exports = StatusCode;
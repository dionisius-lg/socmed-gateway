/**
 * Send 200 OK success response
 * @param {import('express').Response} res - Express response
 * @param {any} result - Response data payload
 * @returns {import('express').Response}
 */
exports.sendSuccess = (res, result) => {
    return res.status(200).send({
        code: 200,
        success: true,
        result
    });
};

/**
 * Send 201 Created success response
 * @param {import('express').Response} res - Express response
 * @param {any} [result] - Response data payload
 * @returns {import('express').Response}
 */
exports.sendSuccessCreated = (res, result) => {
    return res.status(201).send({
        code: 201,
        success: true,
        result: result || {}
    });
};

/**
 * Send 400 Bad Request error response
 * @param {import('express').Response} res - Express response
 * @param {string} [message='Request is invalid'] - Error description
 * @returns {import('express').Response}
 */
exports.sendBadRequest = (res, message = '') => {
    return res.status(400).send({
        code: 400,
        success: false,
        error: message || 'Request is invalid'
    });
};

/**
 * Send 401 Unauthorized error response
 * @param {import('express').Response} res - Express response
 * @param {string} [message] - Error description
 * @returns {import('express').Response}
 */
exports.sendUnauthorized = (res, message = '') => {
    return res.status(401).send({
        code: 401,
        success: false,
        error: message || 'You do not have rights to access this resource'
    });
};

/**
 * Send 403 Forbidden error response
 * @param {import('express').Response} res - Express response
 * @returns {import('express').Response}
 */
exports.sendForbidden = (res) => {
    return res.status(403).send({
        code: 403,
        success: false,
        error: 'You do not have rights to access this resource'
    });
};

/**
 * Send 404 Resource Not Found error response
 * @param {import('express').Response} res - Express response
 * @returns {import('express').Response}
 */
exports.sendNotFound = (res) => {
    return res.status(404).send({
        code: 404,
        success: false,
        error: 'Resource not found'
    });
};

/**
 * Send 404 Data Not Found error response
 * @param {import('express').Response} res - Express response
 * @param {string} [message='Data not found'] - Error description
 * @returns {import('express').Response}
 */
exports.sendNotFoundData = (res, message = '') => {
    return res.status(404).send({
        code: 404,
        success: false,
        error: message || 'Data not found'
    });
};

/**
 * Send 405 Method Not Allowed error response
 * @param {import('express').Response} res - Express response
 * @returns {import('express').Response}
 */
exports.sendMethodNotAllowed = (res) => {
    return res.status(405).send({
        code: 405,
        success: false,
        error: 'This resource is not match with your request method'
    });
};

/**
 * Send 429 Too Many Requests error response
 * @param {import('express').Response} res - Express response
 * @param {string} [message='Too Many Requests'] - Error description
 * @returns {import('express').Response}
 */
exports.sendTooManyRequests = (res, message = '') => {
    return res.status(429).send({
        code: 429,
        success: false,
        error: message || 'Too Many Requests'
    });
};

/**
 * Send 500 Internal Server Error response
 * @param {import('express').Response} res - Express response
 * @returns {import('express').Response}
 */
exports.sendInternalServerError = (res) => {
    return res.status(500).send({
        code: 500,
        success: false,
        error: 'The server encountered an error, please try again later'
    });
};

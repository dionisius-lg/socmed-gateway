const apiHelper = require('./../helpers/api');
const loggerHelper = require('./../helpers/logger');
const responseHelper = require('./../helpers/response');
const valueHelper = require('./../helpers/value');

const { getErrorMessage } = valueHelper;

/**
 * Get Facebook message details by message ID
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 */
exports.getMessageById = async (req, res) => {
    const { query } = req;

    try {
        const endpoint = `/facebook/messengers?page_access_token=${query.account_token}&message_id=${query.message_id}`;
        const api = await apiHelper.get(endpoint);

        if (![200, 201].includes(api.status)) {
            const message = getErrorMessage(api?.data);
            throw new Error(message, { cause: api?.data || null });
        }

        return responseHelper.sendSuccess(res, api?.data || null);
    } catch (err) {
        let message = `Get message ${query.message_id} error!`;

        if (err.message) {
            message += ` ${String(err.message)}`;
        }

        loggerHelper.error({
            source: 'facebook-message:getMessageById',
            message,
            error: err?.cause
        });

        return responseHelper.sendBadRequest(res, message);
    }
};

/**
 * Get Facebook message history by sender ID
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 */
exports.getMessageBySenderId = async (req, res) => {
    const { query } = req;

    try {
        const endpoint = `/facebook/messengers/profile?page_access_token=${query.account_token}&sender_id=${query.sender_id}`;
        const api = await apiHelper.get(endpoint);

        if (![200, 201].includes(api.status)) {
            const message = getErrorMessage(api?.data);
            throw new Error(message, { cause: api?.data || null });
        }

        return responseHelper.sendSuccess(res, api?.data || null);
    } catch (err) {
        let message = `Get message sender ${query.sender_id} error!`;

        if (err.message) {
            message += ` ${String(err.message)}`;
        }

        loggerHelper.error({
            source: 'facebook-message:getMessageBySenderId',
            message,
            error: err?.cause
        });

        return responseHelper.sendBadRequest(res, message);
    }
};

/**
 * Send text message to Facebook Messenger recipient
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 */
exports.sendMessageText = async (req, res) => {
    const { body } = req;

    try {
        const endpoint = `/facebook/messengers/send_text?page_access_token=${body.account_token}`;
        const api = await apiHelper.post(endpoint, {
            recipient_id: body.recipient_id,
            message_type: 'text',
            message: {
                text: body.text
            }
        });

        if (![200, 201].includes(api.status)) {
            const message = getErrorMessage(api?.data);
            throw new Error(message, { cause: api?.data || null });
        }

        return responseHelper.sendSuccess(res, api?.data || null);
    } catch (err) {
        let message = `Send text message ${body.recipient_id} error!`;

        if (err.message) {
            message += ` ${String(err.message)}`;
        }

        loggerHelper.error({
            source: 'facebook-message:sendMessageText',
            message,
            error: err?.cause
        });

        return responseHelper.sendBadRequest(res, message);
    }
};

/**
 * Send media attachment message to Facebook Messenger recipient
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 */
exports.sendMessageMedia = async (req, res) => {
    const { body } = req;

    try {
        const endpoint = `/facebook/messengers/send_attachment?page_access_token=${body.account_token}`;
        const api = await apiHelper.post(endpoint, {
            recipient_id: body.recipient_id,
            message_type: body.file_type,
            message: {
                attachment: {
                    payload: {
                        url: body.file_url
                    }
                }
            }
        });

        if (![200, 201].includes(api.status)) {
            const message = getErrorMessage(api?.data);
            throw new Error(message, { cause: api?.data || null });
        }

        return responseHelper.sendSuccess(res, api?.data || null);
    } catch (err) {
        let message = `Send media message ${body.recipient_id} error!`;

        if (err.message) {
            message += ` ${String(err.message)}`;
        }

        loggerHelper.error({
            source: 'facebook-message:sendMessageMedia',
            message,
            error: err?.cause
        });

        return responseHelper.sendBadRequest(res, message);
    }
};

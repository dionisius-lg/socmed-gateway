const apiHelper = require('./../helpers/api');
const loggerHelper = require('./../helpers/logger');
const responseHelper = require('./../helpers/response');
const valueHelper = require('./../helpers/value');

const { getErrorMessage } = valueHelper;

/**
 * Get facebook comment details by comment ID
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 */
exports.getCommentById = async (req, res) => {
    const { query } = req;

    try {
        const endpoint = `/facebook/comments?page_access_token=${query.account_token}&comment_id=${query.comment_id}`;
        const api = await apiHelper.get(endpoint);

        if (![200, 201].includes(api.status)) {
            const message = getErrorMessage(api?.data);
            throw new Error(message, { cause: api?.data || null });
        }

        return responseHelper.sendSuccess(res, api?.data || null);
    } catch (err) {
        let message = `Get comment ${query.comment_id} error!`;

        if (err.message) {
            message += ` ${String(err.message)}`;
        }

        loggerHelper.error({
            source: 'facebook-comment:getCommentById',
            message,
            error: err?.cause
        });

        return responseHelper.sendBadRequest(res, message);
    }
};

/**
 * Send text comment on a facebook post
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 */
exports.sendCommentText = async (req, res) => {
    const { body } = req;

    try {
        const endpoint = `/facebook/comments/send?page_access_token=${body.account_token}`;
        const api = await apiHelper.post(endpoint, {
            post_id: body.post_id,
            comment: body.text
        });

        if (![200, 201].includes(api.status)) {
            const message = getErrorMessage(api?.data);
            throw new Error(message, { cause: api?.data || null });
        }

        return responseHelper.sendSuccess(res, api?.data || null);
    } catch (err) {
        let message = `Send text comment ${body.post_id} error!`;

        if (err.message) {
            message += ` ${String(err.message)}`;
        }

        loggerHelper.error({
            source: 'facebook-comment:sendCommentText',
            message,
            error: err?.cause
        });

        return responseHelper.sendBadRequest(res, message);
    }
};

/**
 * Send text comment reply to comment on a facebook post
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 */
exports.sendCommentTextReply = async (req, res) => {
    const { body } = req;

    try {
        const endpoint = `/facebook/comments_reply/send?page_access_token=${body.account_token}`;
        const api = await apiHelper.post(endpoint, {
            comment_id: body.comment_id,
            comment: body.text
        });

        if (![200, 201].includes(api.status)) {
            const message = getErrorMessage(api?.data);
            throw new Error(message, { cause: api?.data || null });
        }

        return responseHelper.sendSuccess(res, api?.data || null);
    } catch (err) {
        let message = `Send text comment reply ${body.comment_id} error!`;

        if (err.message) {
            message += ` ${String(err.message)}`;
        }

        loggerHelper.error({
            source: 'facebook-comment:sendCommentTextReply',
            message,
            error: err?.cause
        });

        return responseHelper.sendBadRequest(res, message);
    }
};

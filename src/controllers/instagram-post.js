const apiHelper = require('./../helpers/api');
const loggerHelper = require('./../helpers/logger');
const responseHelper = require('./../helpers/response');
const valueHelper = require('./../helpers/value');

const { getErrorMessage } = valueHelper;

/**
 * Get Instagram post comments by post ID
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 */
exports.getPostId = async (req, res) => {
    const { query } = req;

    try {
        const endpoint = `/instagram/posts?page_access_token=${query.account_token}&post_id=${query.post_id}`;
        const api = await apiHelper.get(endpoint);

        if (![200, 201].includes(api.status)) {
            const message = getErrorMessage(api?.data);
            throw new Error(message, { cause: api?.data || null });
        }

        return responseHelper.sendSuccess(res, api?.data || null);
    } catch (err) {
        let message = `Get post ${query.post_id} error!`;

        if (err.message) {
            message += ` ${String(err.message)}`;
        }

        loggerHelper.error({
            source: 'instagram-post:sendMessagegetPostIdMedia',
            message,
            error: err?.cause
        });

        return responseHelper.sendBadRequest(res, message);
    }
};

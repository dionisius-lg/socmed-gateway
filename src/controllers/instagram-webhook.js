const dayjs = require('dayjs');
const fileHelper = require('./../helpers/file');
const loggerHelper = require('./../helpers/logger');
const responseHelper = require('./../helpers/response');
const messageQueueHelper = require('./../helpers/message-queue');

/**
 * Return instagram webhook service information
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 */
exports.getInfo = async (req, res) => {
    let title = 'Gateway';

    try {
        const pkg = JSON.parse(fileHelper.getContent('package.json'));

        if (pkg.name && typeof pkg.name === 'string') {
            // Split the string into an array by hyphens, capitalize the first letter of each word, join the words with a space
            title = pkg.name
                .split('-')
                .map((w) => (w === 'api' ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
                .join(' ');
        }
    } catch {
        // Do nothing
    }

    return responseHelper.sendSuccess(res, {
        app: `${title} Instagram Webhook`
    });
};

/**
 * Handle instagram account authorization webhook event and publish to queue
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 */
exports.handleAccounts = async (req, res) => {
    const { body } = req;

    try {
        const webhookData = {
            event: 'instagram',
            event_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            event_name: 'auth',
            data: body
        };

        await messageQueueHelper.publish(webhookData);

        loggerHelper.event({
            source: 'instagram-webhook:handleAccounts',
            message: 'Webhook success',
            data: webhookData
        });

        return responseHelper.sendSuccess(res, webhookData);
    } catch (err) {
        loggerHelper.error({
            source: 'instagram-webhook:handleAccounts',
            message: `Webhook error! ${err?.message}`,
            data: body
        });

        return responseHelper.sendBadRequest(res, err?.message || 'Something went wrong');
    }
};

/**
 * Handle instagram feed change webhook event (post/comment) and publish to queue
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 */
exports.handleChanges = async (req, res) => {
    const { body } = req;

    try {
        const entry = body?.data?.entry?.[0];
        const entryField = entry?.changes?.[0]?.field;
        const isComment = ['comment', 'comments'].includes(entryField);

        if (isComment) {
            const webhookData = {
                event: 'instagram',
                event_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                event_name: 'comment',
                data: body
            };

            await messageQueueHelper.publish(webhookData);

            return responseHelper.sendSuccess(res, webhookData);
        }

        return responseHelper.sendSuccess(res, body);
    } catch (err) {
        loggerHelper.error({
            source: 'instagram-webhook:handleChanges',
            message: `Webhook error! ${err?.message}`,
            data: body
        });

        return responseHelper.sendBadRequest(res, err?.message || 'Something went wrong');
    }
};

/**
 * Handle instagram message webhook event and publish to queue
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 */
exports.handleMessages = async (req, res) => {
    const { body } = req;

    try {
        const webhookData = {
            event: 'instagram',
            event_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            event_name: 'message',
            data: body
        };

        await messageQueueHelper.publish(webhookData);

        loggerHelper.event({
            source: 'instagram-webhook:handleMessages',
            message: 'Webhook success',
            data: webhookData
        });

        return responseHelper.sendSuccess(res, webhookData);
    } catch (err) {
        loggerHelper.error({
            source: 'instagram-webhook:handleMessages',
            message: `Webhook error! ${err?.message}`,
            data: body
        });

        return responseHelper.sendBadRequest(res, err?.message || 'Something went wrong');
    }
};

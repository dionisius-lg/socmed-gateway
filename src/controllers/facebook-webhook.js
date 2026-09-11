const dayjs = require('dayjs');
const fileHelper = require('./../helpers/file');
const loggerHelper = require('./../helpers/logger');
const responseHelper = require('./../helpers/response');
const messageQueueHelper = require('./../helpers/message-queue');

/**
 * Return facebook webhook service information
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
        app: `${title} Facebook Webhook`
    });
};

/**
 * Handle facebook account authorization webhook event and publish to queue
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 */
exports.handleAccounts = async (req, res) => {
    const { body } = req;

    try {
        const webhookData = {
            event: 'facebook',
            event_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            event_name: 'auth',
            data: body
        };

        await messageQueueHelper.publish(webhookData);

        loggerHelper.event({
            source: 'facebook-webhook:handleAccounts',
            message: 'Webhook success',
            data: webhookData
        });

        return responseHelper.sendSuccess(res, webhookData);
    } catch (err) {
        loggerHelper.error({
            source: 'facebook-webhook:handleAccounts',
            message: `Webhook error! ${err?.message}`,
            data: body
        });

        return responseHelper.sendBadRequest(res, err?.message || 'Something went wrong');
    }
};

/**
 * Handle facebook feed change webhook event (post/comment) and publish to queue
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 */
exports.handleChanges = async (req, res) => {
    const { body } = req;

    try {
        const entry = body?.data?.entry?.[0];
        const entryValue = entry?.changes?.[0]?.value;

        // Differentiate between comment and post feed events
        const isComment = entryValue?.item === 'comment' || Boolean(entryValue?.comment_id);
        const isPost = ['status', 'post', 'photo', 'video', 'share'].includes(entryValue?.item) || (Boolean(entryValue?.post_id) && !entryValue?.comment_id);

        let eventName = 'comment';

        if (isPost) {
            eventName = 'post';
        } else if (isComment) {
            eventName = 'comment';
        }

        const webhookData = {
            event: 'facebook',
            event_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            event_name: eventName,
            data: body
        };

        await messageQueueHelper.publish(webhookData);

        loggerHelper.event({
            source: 'facebook-webhook:handleChanges',
            message: 'Webhook success',
            data: webhookData
        });

        return responseHelper.sendSuccess(res, webhookData);
    } catch (err) {
        loggerHelper.error({
            source: 'facebook-webhook:handleChanges',
            message: `Webhook error! ${err?.message}`,
            data: body
        });

        return responseHelper.sendBadRequest(res, err?.message || 'Something went wrong');
    }
};

/**
 * Handle facebook message webhook event and publish to queue
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 */
exports.handleMessages = async (req, res) => {
    const { body } = req;

    try {
        const webhookData = {
            event: 'facebook',
            event_time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            event_name: 'message',
            data: body
        };

        await messageQueueHelper.publish(webhookData);

        loggerHelper.event({
            source: 'facebook-webhook:handleMessages',
            message: 'Webhook success',
            data: webhookData
        });

        return responseHelper.sendSuccess(res, webhookData);
    } catch (err) {
        loggerHelper.error({
            source: 'facebook-webhook:handleMessages',
            message: `Webhook error! ${err?.message}`,
            data: body
        });

        return responseHelper.sendBadRequest(res, err?.message || 'Something went wrong');
    }
};

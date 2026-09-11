const messageQueue = require('./../config/message-queue');
const loggerHelper = require('./logger');

/**
 * Publish message payload to RabbitMQ queue with broker confirmation
 * @param {Object} data - Payload data to publish
 * @returns {Promise<Object|null>} Published data or null on failure
 */
exports.publish = async (data) => {
    const connection = messageQueue.connection();

    if (!connection) {
        loggerHelper.error({
            source: 'message-queue',
            message: 'Publish error! Connection not established'
        });

        return null;
    }

    const channel = messageQueue.channel();

    if (!channel) {
        loggerHelper.error({
            source: 'message-queue',
            message: 'Publish error! Channel not available'
        });

        return null;
    }

    const { exchange, routingKey } = messageQueue;
    const message = Buffer.from(JSON.stringify(data), 'utf-8');

    try {
        channel.publish(exchange, routingKey, message, { persistent: true });
        await channel.waitForConfirms();

        loggerHelper.event({
            source: 'message-queue',
            message: 'Data published to queue',
            data
        });

        return data;
    } catch (err) {
        loggerHelper.error({
            source: 'message-queue',
            message: `Publish error: ${err?.message}`,
            error: err
        });

        return null;
    }
};

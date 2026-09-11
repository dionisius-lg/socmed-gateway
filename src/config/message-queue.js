const amqp = require('amqplib');
const config = require('./index');
const valueHelper = require('./../helpers/value');

const {
    message_queue: { host, port, username, password, exchange, queue, routing_key: routingKey, vhost }
} = config;
const { getErrorMessage } = valueHelper;

// Encode credentials to prevent URI parsing failures on special characters
const encodedUser = encodeURIComponent(username || '');
const encodedPass = encodeURIComponent(password || '');
const encodedVhost = vhost ? encodeURIComponent(vhost) : '';
const url = `amqp://${encodedUser}:${encodedPass}@${host}:${port}/${encodedVhost}`;

let connection = null;
let channel = null;
let reconnectTimer = null;
let isConnecting = false;

const scheduleReconnect = () => {
    if (reconnectTimer || isConnecting) return;

    connection = null;
    channel = null;

    reconnectTimer = setTimeout(async () => {
        reconnectTimer = null;
        await initialize();
    }, 3000);
};

/**
 * Initialize AMQP RabbitMQ connection and confirm channel
 * @returns {Promise<{connection: import('amqplib').Connection, channel: import('amqplib').ConfirmChannel}|void>}
 */
const initialize = async () => {
    if (isConnecting) return;

    isConnecting = true;

    try {
        const conn = await amqp.connect(url);
        const chn = await conn.createConfirmChannel();

        if (queue) {
            await chn.assertQueue(queue, { durable: true });
        }

        connection = conn;
        channel = chn;
        isConnecting = false;

        // eslint-disable-next-line no-console
        console.log('[messageQueue] connected & channel ready');

        conn.on('error', (err) => {
            // eslint-disable-next-line no-console
            console.error('[messageQueue] connection error:', getErrorMessage(err));
        });

        conn.on('close', () => {
            // eslint-disable-next-line no-console
            console.warn('[messageQueue] connection closed, scheduling reconnect...');
            scheduleReconnect();
        });

        chn.on('error', (err) => {
            // eslint-disable-next-line no-console
            console.error('[messageQueue] channel error:', getErrorMessage(err));
        });

        chn.on('close', () => {
            // eslint-disable-next-line no-console
            console.warn('[messageQueue] channel closed, scheduling reconnect...');
            scheduleReconnect();
        });

        return { connection, channel };
    } catch (err) {
        isConnecting = false;
        // eslint-disable-next-line no-console
        console.error('[messageQueue] connection failed:', getErrorMessage(err));
        scheduleReconnect();
    }
};

/**
 * Gracefully close AMQP connection and channel
 * @returns {Promise<void>}
 */
const close = async () => {
    try {
        if (channel) await channel.close();

        if (connection) await connection.close();
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[messageQueue] close error:', getErrorMessage(err));
    }
};

module.exports = {
    init: initialize,
    close,
    connection: () => connection,
    channel: () => channel,
    exchange,
    routingKey
};

const dotenv = require('dotenv');

dotenv.config({
    path: './.env',
    override: true,
    quiet: true
});

const config = {
    env: process.env.NODE_ENV || 'development',
    timezone: 'Asia/Jakarta',
    port: process.env.PORT || 3000,
    secret: process.env.SECRET_KEY || '',
    proxy_path: process.env.PROXY_PATH || '',
    api: {
        url: process.env.SOCMED_API_URL || 'http://localhost',
        key: process.env.SOCMED_API_KEY || ''
    },
    modem: {
        recipient_id: process.env.MODEM_RECIPIENT_ID || 'webcc',
        sender_id: process.env.MODEM_SENDER_ID || 'SMS Gateway',
        smsc: process.env.MODEM_SMSC || '+62818445009',
        com_port: process.env.MODEM_COM_PORT || '/dev/ttyUSB0',
        baud_rate: Number(process.env.MODEM_BAUD_RATE) || 115200
    },
    database: {
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        name: process.env.DB_NAME || ''
    },
    message_queue: {
        host: process.env.MQ_HOST || 'localhost',
        port: process.env.MQ_PORT || 5672,
        username: process.env.MQ_USERNAME || '',
        password: process.env.MQ_PASSWORD || '',
        exchange: process.env.MQ_EXCHANGE || '',
        queue: process.env.MQ_QUEUE || '',
        routing_key: process.env.MQ_ROUTING_KEY || '',
        vhost: process.env.MQ_VHOST || ''
    }
};

module.exports = config;

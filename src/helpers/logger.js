const dayjs = require('dayjs');
const morgan = require('morgan');
const winston = require('winston');
require('winston-daily-rotate-file');
const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');
const valueHelper = require('./value');

const createStreamLogger = (type = 'access') => {
    const dir = path.resolve('./', 'logs', type);

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const filename = (time) => {
        return time ? `${type}-${dayjs(time).format('YYYY-MM-DD')}.log.gz` : `${type}.log`;
    };

    const stream = rfs.createStream(filename, {
        interval: '1d',
        path: dir,
        compress: 'gzip',
        maxFiles: 90
    });

    stream.on('rotated', (filename) => {
        // eslint-disable-next-line no-console
        console.log(`[logger] Rotate ${type} log:`, filename);
    });

    stream.on('error', (err) => {
        // eslint-disable-next-line no-console
        console.log(`[logger] Stream ${type} log error:`, err);
    });

    return stream;
};

const createTransportLogger = (type) => {
    const logDir = path.resolve('./', 'logs', type);

    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }

    const fileTransportConfig = {
        level: 'info',
        filename: path.resolve(logDir, `${type}-%DATE%.log`),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxFiles: '90d',
        maxSize: '20m',
        tailable: true,
        auditFile: path.resolve(logDir, `${type}-audit.json`),
        options: { flags: 'a' }
    };

    const logFormat = winston.format.printf((info) => {
        const logData = {
            source: info.source,
            message: info.message
        };

        if (info.data) {
            logData.data = info.data;
        }

        if (info.error) {
            if (info.error instanceof Error) {
                logData.error = {
                    message: info.error.message,
                    stack: info.error.stack
                };
            } else {
                logData.error = info.error;
            }
        }

        if (info.event) {
            logData.event = info.event;
        }

        return `${info.timestamp} ${JSON.stringify(logData)}`;
    });

    const logger = winston.createLogger({
        level: 'info',
        transports: [
            new winston.transports.Console({
                format: winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat)
            }),

            new winston.transports.DailyRotateFile({
                ...fileTransportConfig,
                format: winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat)
            })
        ]
    });

    return logger;
};

const cacheStreamLogger = {};
const cacheTransportLogger = {};

const streamLogger = (type = 'debug') => {
    if (cacheStreamLogger[type]) {
        return cacheStreamLogger[type];
    }

    const logger = createStreamLogger(type);
    cacheStreamLogger[type] = logger;

    return logger;
};

const transportLogger = (type = 'debug') => {
    if (cacheTransportLogger[type]) {
        return cacheTransportLogger[type];
    }

    const logger = createTransportLogger(type);
    cacheTransportLogger[type] = logger;

    return logger;
};

/**
 * Initialize HTTP request access logging middleware using Morgan
 * @param {import('express').Application} app - Express application instance
 */
exports.access = (app) => {
    const stream = streamLogger('access');

    morgan.token('body', (req) => {
        let { body } = req;

        if (body && typeof body === 'object') {
            body = valueHelper.maskSensitiveData(body);

            return JSON.stringify(body);
        }

        return '';
    });

    morgan.token('date', () => {
        return dayjs().format('YYYY-MM-DD HH:mm:ss');
    });

    morgan.token('secret', (req) => {
        const authKey = req.headers && req.headers['x-api-key'];

        if (authKey && typeof authKey === 'string') {
            const masked = valueHelper.maskSensitiveData({ secret: authKey });

            return masked.secret;
        }

        return '-';
    });

    app.use(morgan(':remote-addr :remote-user [:date] :status [secret=:secret] ":method :url HTTP/:http-version" :body :response-time ms - :res[content-length]', { stream }));
};

/**
 * Log debug or informational event
 * @param {Object} payload
 * @param {string} [payload.source='app'] - Originating source identifier
 * @param {string} payload.message - Log message
 */
exports.debug = ({ source = 'app', message = '' }) => {
    const logger = transportLogger('debug');
    logger.info({ source, message });
};

/**
 * Log error event with optional stack trace and context data
 * @param {Object} payload
 * @param {string} [payload.source='app'] - Originating source identifier
 * @param {string} payload.message - Error message
 * @param {any} [payload.data] - Additional contextual data
 * @param {any} [payload.error] - Error object or cause
 */
exports.error = ({ source = 'app', message = '', data = null, error = null }) => {
    const logger = transportLogger('error');
    logger.error({ source, message, data, error });
};

/**
 * Log business domain event
 * @param {Object} payload
 * @param {string} [payload.source='app'] - Originating source identifier
 * @param {string} payload.message - Event description
 * @param {any} [payload.data] - Event payload data
 * @param {string} [payload.event] - Event type name
 */
exports.event = ({ source = 'app', message = '', data = null, event = null }) => {
    const logger = transportLogger('event');
    logger.info({ source, message, data, event });
};

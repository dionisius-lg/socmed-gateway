const responseHelper = require('./../helpers/response');

const ipRequestMap = new Map();

// Periodic cleanup to avoid memory leak
const cleanupInterval = setInterval(() => {
    const now = Date.now();

    for (const [ip, record] of ipRequestMap.entries()) {
        if (now - record.startTime > record.windowMs) {
            ipRequestMap.delete(ip);
        }
    }
}, 5 * 60 * 1000);

if (cleanupInterval.unref) {
    cleanupInterval.unref();
}

/**
 * In-memory rate limiter middleware
 * @param {Object} options
 * @param {number} options.windowMs - Time window in milliseconds (default: 1 minute)
 * @param {number} options.max - Max requests per IP in windowMs (default: 100)
 * @param {string} options.message - Custom error message
 */
const rateLimiter = (options = {}) => {
    const windowMs = options.windowMs || 60 * 1000;
    const max = options.max || 100;
    const message = options.message || 'Too many requests, please try again later';

    return (req, res, next) => {
        const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
        const now = Date.now();

        if (!ipRequestMap.has(clientIp)) {
            ipRequestMap.set(clientIp, {
                count: 1,
                startTime: now,
                windowMs
            });

            return next();
        }

        const clientData = ipRequestMap.get(clientIp);

        if (now - clientData.startTime > windowMs) {
            clientData.count = 1;
            clientData.startTime = now;

            return next();
        }

        clientData.count += 1;

        if (clientData.count > max) {
            return responseHelper.sendTooManyRequests(res, message);
        }

        return next();
    };
};

module.exports = rateLimiter;

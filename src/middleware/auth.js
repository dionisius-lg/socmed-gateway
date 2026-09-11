const crypto = require('crypto');
const config = require('./../config');
const responseHelper = require('./../helpers/response');
const valueHelper = require('./../helpers/value');

const { timingSafeEqual } = crypto;
const { secret } = config;
const { isEmpty } = valueHelper;

const safeCompare = (a, b) => {
    if (typeof a !== 'string' || typeof b !== 'string') return false;

    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);

    if (bufA.length !== bufB.length) return false;

    return timingSafeEqual(bufA, bufB);
};

/**
 * Verify api key
 * @param  {Object} req - Express request object
 * @param  {Object} res - Express response object
 * @param  {Object} next - Express next method
 */
exports.authenticateKey = async (req, res, next) => {
    const authKey = req.headers?.['x-api-key'] || null;

    if (!isEmpty(secret)) {
        if (isEmpty(authKey)) {
            return responseHelper.sendForbidden(res);
        }

        if (!safeCompare(authKey, secret)) {
            return responseHelper.sendUnauthorized(res, 'API key not valid');
        }
    }

    return next();
};

/**
 * Verify api token
 * @param  {Object} req - Express request object
 * @param  {Object} res - Express response object
 * @param  {Object} next - Express next method
 */
exports.authenticateToken = async (req, res, next) => {
    let authToken = null;

    if (req.query && 'token' in req.query) {
        authToken = req.query.token;
        delete req.query.token;
    }

    if (!isEmpty(secret)) {
        if (isEmpty(authToken)) {
            return responseHelper.sendForbidden(res);
        }

        const expectedToken = crypto.createHash('sha256').update(secret).digest('hex');
        // expectedToken = cdc16a6af93bd40a647812e9532591e9583d1a740109d02f1f44a67beb6f746d

        if (!safeCompare(authToken, expectedToken)) {
            return responseHelper.sendUnauthorized(res, 'API token not valid');
        }
    }

    return next();
};

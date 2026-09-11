const responseHelper = require('./../helpers/response');

/**
 * Validate request property against Joi schema
 * @param {import('joi').ObjectSchema} schema - Joi validation schema
 * @param {'body'|'query'|'params'} property - Request property to validate
 * @returns {import('express').RequestHandler} Express middleware
 */
const validation = (schema, property) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[property]);

        if (error) {
            const { details } = error;
            const message = details.map((i) => i.message).join(',');

            return responseHelper.sendBadRequest(res, message);
        }

        if (['body', 'params', 'query'].includes(property)) {
            req[property] = value;
        }

        return next();
    };
};

module.exports = validation;

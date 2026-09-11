const apiHelper = require('./../helpers/api');
const loggerHelper = require('./../helpers/logger');
const responseHelper = require('./../helpers/response');
const valueHelper = require('./../helpers/value');

const { getErrorMessage } = valueHelper;

/**
 * Enable or disable Instagram Page account
 * @param {import('express').Request} req - Express request
 * @param {import('express').Response} res - Express response
 */
exports.updateAccount = async (req, res) => {
    const { body } = req;

    try {
        let endpoint = '/instagram/account';

        if (body.enabled === true) {
            endpoint += '/enable';
        } else {
            endpoint += '/disable';
        }

        endpoint += `?page_access_token=${body.account_token}`;

        const api = await apiHelper.post(endpoint, {
            instagram_business_account_id: body.account_id
        });

        if (![200, 201].includes(api.status)) {
            const message = getErrorMessage(api?.data);
            throw new Error(message, { cause: api?.data || null });
        }

        return responseHelper.sendSuccess(res, api?.data || null);
    } catch (err) {
        let message = `Update account message ${body.account_id} error!`;

        if (err.message) {
            message += ` ${String(err.message)}`;
        }

        loggerHelper.error({
            source: 'instagram-account:updateAccount',
            message,
            error: err?.cause
        });

        return responseHelper.sendBadRequest(res, message);
    }
};

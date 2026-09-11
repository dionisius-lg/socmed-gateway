const joi = require('joi');
const joiStringFactory = require('joi-phone-number');
const joiExtended = joi.extend(joiStringFactory);

const schema = {
    updateAccount: joiExtended.object().keys({
        account_token: joiExtended.string().min(1).required(),
        account_id: joiExtended.string().min(1).required(),
        enabled: joiExtended.boolean().required()
    })
};

module.exports = schema;

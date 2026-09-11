const joi = require('joi');
const joiStringFactory = require('joi-phone-number');
const joiExtended = joi.extend(joiStringFactory);

const schema = {
    getPostById: joiExtended.object().keys({
        account_token: joiExtended.string().min(1).required(),
        post_id: joiExtended.string().min(1).required()
    })
};

module.exports = schema;

const joi = require('joi');
const joiStringFactory = require('joi-phone-number');
const joiExtended = joi.extend(joiStringFactory);

const s3UriPattern = /^https:\/\/([a-zA-Z0-9-]+\.)*s3\.([a-zA-Z0-9-]+\.)*amazonaws\.com\/.+$/;

const schema = {
    getMessageById: joiExtended.object().keys({
        account_token: joiExtended.string().min(1).required(),
        message_id: joiExtended.string().min(1).required()
    }),
    getMessageBySenderId: joiExtended.object().keys({
        account_token: joiExtended.string().min(1).required(),
        sender_id: joiExtended.string().min(1).required()
    }),
    sendMessageText: joiExtended.object().keys({
        account_token: joiExtended.string().min(1).required(),
        recipient_id: joiExtended.string().min(1).required(),
        text: joiExtended.string().min(1).required()
    }),
    sendMessageMedia: joiExtended.object().keys({
        account_token: joiExtended.string().min(1).required(),
        recipient_id: joiExtended.string().min(1).required(),
        file_type: joiExtended.string().min(1).required(),
        file_url: joiExtended.alternatives().try(
            joiExtended.string().uri().required(),
            joiExtended.string().pattern(s3UriPattern).required()
        ).required().messages({
            'alternatives.match': '{{#label}} must be a valid uri'
        })
    })
};

module.exports = schema;

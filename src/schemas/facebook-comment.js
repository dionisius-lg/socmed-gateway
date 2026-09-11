const joi = require('joi');
const joiStringFactory = require('joi-phone-number');
const joiExtended = joi.extend(joiStringFactory);

const schema = {
    getCommentById: joiExtended.object().keys({
        account_token: joiExtended.string().min(1).required(),
        comment_id: joiExtended.string().min(1).required()
    }),
    sendCommentText: joiExtended.object().keys({
        account_token: joiExtended.string().min(1).required(),
        post_id: joiExtended.string().min(1).required(),
        text: joiExtended.string().min(1).required()
    }),
    sendCommentTextReply: joiExtended.object().keys({
        account_token: joiExtended.string().min(1).required(),
        comment_id: joiExtended.string().min(1).required(),
        text: joiExtended.string().min(1).required()
    })
};

module.exports = schema;

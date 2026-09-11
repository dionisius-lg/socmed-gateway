const router = require('express').Router();
const accountController = require('./../controllers/facebook-account');
const commentController = require('./../controllers/facebook-comment');
const messageController = require('./../controllers/facebook-message');
const webhookController = require('./../controllers/facebook-webhook')
const postController = require('./../controllers/facebook-post');
const accountSchema = require('./../schemas/facebook-account');
const commentSchema = require('./../schemas/facebook-comment');
const messageSchema = require('./../schemas/facebook-message');
const postSchema = require('./../schemas/facebook-post');
const validation = require('./../middleware/validation');
const auth = require('./../middleware/auth');

router.post('/account', auth.authenticateKey, validation(accountSchema.updateAccount, 'body'), accountController.updateAccount);

router.get('/comment', auth.authenticateKey, validation(commentSchema.getCommentById, 'query'), commentController.getCommentById);

router.post('/comment', auth.authenticateKey, validation(commentSchema.sendCommentText, 'body'), commentController.sendCommentText);

router.post('/comment/reply', auth.authenticateKey, validation(commentSchema.sendCommentTextReply, 'body'), commentController.sendCommentTextReply);

router.get('/message', auth.authenticateKey, validation(messageSchema.getMessageById, 'query'), messageController.getMessageById);

router.get('/message/profile', auth.authenticateKey, validation(messageSchema.getMessageBySenderId, 'query'), messageController.getMessageBySenderId);

router.post('/message', auth.authenticateKey, validation(messageSchema.sendMessageText, 'body'), messageController.sendMessageText);

router.post('/message/media', auth.authenticateKey, validation(messageSchema.sendMessageMedia, 'body'), messageController.sendMessageMedia);

router.get('/post', auth.authenticateKey, validation(postSchema.getPostById, 'query'), postController.getPostId);

router.get('/webhook', webhookController.getInfo);
``
router.post('/webhook/accounts', auth.authenticateToken, webhookController.handleAccounts);

router.post('/webhook/changes', auth.authenticateToken, webhookController.handleChanges);

router.post('/webhook/messages', auth.authenticateToken, webhookController.handleMessages);

module.exports = router;

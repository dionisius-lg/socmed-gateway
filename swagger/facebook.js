const facebookAccount = {
    path: '/account',
    method: {
        post: {
            summary: 'Update account',
            security: [
                {
                    apiKeyAuth: []
                }
            ],
            parameters: [],
            requestBody: {
                content: {
                    'application/x-www-form-urlencoded': {
                        schema: {
                            type: 'object',
                            required: ['account_token', 'account_id', 'enabled'],
                            properties: {
                                account_token: {
                                    type: 'string',
                                    default: ''
                                },
                                account_id: {
                                    type: 'string',
                                    default: ''
                                },
                                enabled: {
                                    type: 'boolean',
                                    enum: [true, false]
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

const facebookComment = {
    path: '/comment',
    method: {
        get: {
            summary: 'Get detail of comment',
            security: [
                {
                    apiKeyAuth: []
                }
            ],
            parameters: [
                {
                    in: 'query',
                    name: 'account_token',
                    schema: {
                        type: 'string'
                    },
                    required: true
                },
                {
                    in: 'query',
                    name: 'comment_id',
                    schema: {
                        type: 'string'
                    },
                    required: true
                }
            ]
        },
        post: {
            summary: 'Send text comment',
            security: [
                {
                    apiKeyAuth: []
                }
            ],
            parameters: [],
            requestBody: {
                content: {
                    'application/x-www-form-urlencoded': {
                        schema: {
                            type: 'object',
                            required: ['account_token', 'post_id', 'text'],
                            properties: {
                                account_token: {
                                    type: 'string',
                                    default: ''
                                },
                                post_id: {
                                    type: 'string',
                                    default: ''
                                },
                                text: {
                                    type: 'string',
                                    default: ''
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

const facebookCommentReply = {
    path: '/comment/reply',
    method: {
        post: {
            summary: 'Send text comment reply',
            security: [
                {
                    apiKeyAuth: []
                }
            ],
            parameters: [],
            requestBody: {
                content: {
                    'application/x-www-form-urlencoded': {
                        schema: {
                            type: 'object',
                            required: ['account_token', 'comment_id', 'text'],
                            properties: {
                                account_token: {
                                    type: 'string',
                                    default: ''
                                },
                                comment_id: {
                                    type: 'string',
                                    default: ''
                                },
                                text: {
                                    type: 'string',
                                    default: ''
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

const facebookMessage = {
    path: '/message',
    method: {
        get: {
            summary: 'Get detail of message',
            security: [
                {
                    apiKeyAuth: []
                }
            ],
            parameters: [
                {
                    in: 'query',
                    name: 'account_token',
                    schema: {
                        type: 'string'
                    },
                    required: true
                },
                {
                    in: 'query',
                    name: 'message_id',
                    schema: {
                        type: 'string'
                    },
                    required: true
                }
            ]
        },
        post: {
            summary: 'Send text message',
            security: [
                {
                    apiKeyAuth: []
                }
            ],
            parameters: [],
            requestBody: {
                content: {
                    'application/x-www-form-urlencoded': {
                        schema: {
                            type: 'object',
                            required: ['account_token', 'recipient_id', 'text'],
                            properties: {
                                account_token: {
                                    type: 'string',
                                    default: ''
                                },
                                recipient_id: {
                                    type: 'string',
                                    default: ''
                                },
                                text: {
                                    type: 'string',
                                    default: ''
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

const facebookMessageProfile = {
    path: '/message/profile',
    method: {
        get: {
            summary: 'Get detail of message sender',
            security: [
                {
                    apiKeyAuth: []
                }
            ],
            parameters: [
                {
                    in: 'query',
                    name: 'account_token',
                    schema: {
                        type: 'string'
                    },
                    required: true
                },
                {
                    in: 'query',
                    name: 'sender_id',
                    schema: {
                        type: 'string'
                    },
                    required: true
                }
            ]
        }
    }
};

const facebookMessageMedia = {
    path: '/message/media',
    method: {
        post: {
            summary: 'Send media message',
            security: [
                {
                    apiKeyAuth: []
                }
            ],
            parameters: [],
            requestBody: {
                content: {
                    'application/x-www-form-urlencoded': {
                        schema: {
                            type: 'object',
                            required: ['account_token', 'recipient_id', 'file_type', 'file_url'],
                            properties: {
                                account_token: {
                                    type: 'string',
                                    default: ''
                                },
                                recipient_id: {
                                    type: 'string',
                                    default: ''
                                },
                                file_type: {
                                    type: 'string',
                                    default: ''
                                },
                                file_url: {
                                    type: 'string',
                                    default: ''
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

const facebookPost = {
    path: '/post',
    method: {
        get: {
            summary: 'Get detail of post',
            security: [
                {
                    apiKeyAuth: []
                }
            ],
            parameters: [
                {
                    in: 'query',
                    name: 'account_token',
                    schema: {
                        type: 'string'
                    },
                    required: true
                },
                {
                    in: 'query',
                    name: 'post_id',
                    schema: {
                        type: 'string'
                    },
                    required: true
                }
            ]
        }
    }
};

module.exports = [facebookAccount, facebookComment, facebookCommentReply, facebookMessage, facebookMessageProfile, facebookMessageMedia, facebookPost];

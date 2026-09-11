const axios = require('axios');
const config = require('./../config');
const loggerHelper = require('./logger');
const valueHelper = require('./value');

const {
    api: { url, key }
} = config;
const { safeJsonParse } = valueHelper;

const instance = axios.create({
    baseURL: url,
    headers: { accept: 'application/json', 'x-api-key': `${key}` }
});

/**
 * Handle Axios request error with structured logging
 * @param {import('axios').AxiosError} err - Axios error object
 * @returns {Object} Normalized error response
 */
const requestErr = (err) => {
    if (err.response) {
        let request = null;
        let response = null;

        if (err.config?.data) {
            request = safeJsonParse(err.config.data);
        }

        if (err.response?.data) {
            response = safeJsonParse(err.response.data);
        }

        loggerHelper.error({
            source: 'api',
            message: err?.message || 'Something went wrong',
            error: { request, response }
        });

        return err.response;
    }

    loggerHelper.error({
        source: 'api',
        message: err?.message || 'Internal Server Error'
    });

    return {
        status: 500,
        data: { error_message: err?.message || 'Internal Server Error' }
    };
};

/**
 * Send HTTP request to downstream API
 * @param {Object} options
 * @param {string} options.method - HTTP method
 * @param {string} options.endpoint - Target endpoint path
 * @param {Object} [options.body] - Request body payload
 * @returns {Promise<{status: number, data: any}>} API response
 */
const requestApi = async ({ method, endpoint, body }) => {
    let result = {};

    switch (method) {
        case 'GET':
            result = await instance.get(endpoint).catch(requestErr);
            break;
        case 'POST':
            result = await instance.post(endpoint, body || {}, { headers: { 'Content-Type': 'application/json' } }).catch(requestErr);
            break;
        case 'PUT':
            result = await instance.put(endpoint, body || {}, { headers: { 'Content-Type': 'application/json' } }).catch(requestErr);
            break;
        case 'PATCH':
            result = await instance.patch(endpoint, body || {}, { headers: { 'Content-Type': 'application/json' } }).catch(requestErr);
            break;
        case 'DELETE':
            result = await instance.delete(endpoint).catch(requestErr);
            break;
        case 'UPLOAD':
            result = await instance.post(endpoint, body || {}, { headers: { 'Content-Type': 'multipart/form-data' } }).catch(requestErr);
            break;
    }

    return {
        status: result.status,
        data: result.data
    };
};

/**
 * Request handler factory for specified HTTP method
 * @param {string} method - HTTP method
 * @returns {(endpoint: string, body?: any) => Promise<{status: number, data: any}>}
 */
const request = (method) => {
    return async (endpoint, body) => {
        return await requestApi({ method, endpoint, body });
    };
};

module.exports = {
    get: request('GET'),
    post: request('POST'),
    put: request('PUT'),
    patch: request('PATCH'),
    delete: request('DELETE'),
    upload: request('UPLOAD')
};

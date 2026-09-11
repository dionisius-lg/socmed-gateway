/**
 * Check if a value is empty (null, undefined, empty string, empty array, or empty object)
 * @param {any} value - Value to check
 * @returns {boolean} True if empty, false otherwise
 */
const isEmpty = (value) => {
    if (value === undefined || value === null) return true;

    if (typeof value === 'string') return value.trim().length === 0;

    if (Array.isArray(value)) return value.length === 0;

    if (typeof value === 'object') return Object.keys(value).length === 0;

    if (typeof value === 'boolean') return value === false;

    return false;
};

/**
 * Check if string is a domain address (not IP or localhost)
 * @param {string} value - String to test
 * @returns {boolean} True if domain address, false otherwise
 */
const isDomainAddress = (value = '') => {
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(value) || value.includes('localhost')) {
        return false;
    }

    return true;
};

/**
 * Mask sensitive keys (secret, password, key) with asterisks
 * @param {Object} data - Object containing potential sensitive data
 * @returns {Object} Masked data copy
 */
const maskSensitiveData = (data = {}) => {
    const sensitiveKeys = ['secret', 'password', 'key'];
    const masked = { ...data };

    for (const [key, value] of Object.entries(masked)) {
        if (sensitiveKeys.includes(key.toLowerCase()) && typeof value === 'string') {
            masked[key] = value.replace(/./g, '*');
        }
    }

    return masked;
};

/**
 * Delay execution for specified milliseconds
 * @param {number} milliseconds - Sleep duration in ms
 * @returns {Promise<void>}
 */
const sleep = (milliseconds = 0) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

/**
 * Recursively parse JSON strings safely up to max depth
 * @param {any} value - Value to parse
 * @param {Object} [options]
 * @param {number} [options.maxDepth=3] - Maximum recursion depth
 * @param {number} [options.maxStringLength=1048576] - Maximum string length to parse
 * @returns {any} Parsed JSON or original value
 */
const safeJsonParse = (value, { maxDepth = 3, maxStringLength = 1048576 } = {}) => {
    const limitDepth = Number.isInteger(maxDepth) && maxDepth >= 0 ? maxDepth : 3;
    const limitLength = Number.isInteger(maxStringLength) && maxStringLength > 0 ? maxStringLength : 1024 * 1024; // 1 MB

    const parse = (input, depth) => {
        if (depth > limitDepth) {
            return input;
        }

        if (input === null || input === undefined) {
            return input;
        }

        if (typeof input === 'object') {
            return input;
        }

        if (typeof input !== 'string') {
            return input;
        }

        if (input.length > limitLength) {
            return input;
        }

        const trimmed = input.trim();

        if (!trimmed) {
            return input;
        }

        try {
            const parsed = JSON.parse(trimmed);

            return typeof parsed === 'string' && parsed !== trimmed ? parse(parsed, depth + 1) : parsed;
        } catch {
            return input;
        }
    };

    return parse(value, 0);
};

/**
 * Extract human-readable error message from various error types
 * @param {any} error - Error object, string, or instance
 * @param {string} [fallback='Unknown error'] - Fallback error message
 * @returns {string} Formatted error message
 */
const getErrorMessage = (error, fallback = 'Unknown error') => {
    if (!error) {
        return fallback;
    }

    if (error instanceof AggregateError) {
        return error.errors?.[0]?.message || error.message || fallback;
    }

    if (error instanceof Error) {
        return error.message || fallback;
    }

    if (typeof error === 'string') {
        return error || fallback;
    }

    if (typeof error === 'object') {
        const candidates = [error.message, error.error_message, error.status, error.errors, error.error];

        for (const value of candidates) {
            if (typeof value === 'string' && value.trim()) {
                return value;
            }

            if (value && typeof value === 'object' && typeof value.details === 'string' && value.details.trim()) {
                return value.details;
            }
        }
    }

    return fallback;
};

module.exports = {
    isEmpty,
    isDomainAddress,
    maskSensitiveData,
    sleep,
    safeJsonParse,
    getErrorMessage
};

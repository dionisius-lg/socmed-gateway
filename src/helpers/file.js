const fs = require('fs');
const path = require('path');
const loggerHelper = require('./logger');
const valueHelper = require('./value');

const { existsSync, mkdirSync, readFileSync, writeFileSync } = fs;
const { dirname, resolve } = path;
const { isEmpty } = valueHelper;

/**
 * Read file content safely as UTF-8 string
 * @param {string} filename - Target file name
 * @param {string} [subpath] - Optional sub-directory path
 * @returns {string|null} File content or null on error
 */
exports.getContent = (filename = '', subpath = '') => {
    try {
        if (isEmpty(filename)) {
            throw new Error('Filename cannot be empty');
        }

        if (filename.includes('..')) {
            throw new Error('Invalid filename: Directory traversal is not allowed');
        }

        // Sanitize filename to prevent directory traversal
        const sanitizedFilename = filename.replace(/[^a-zA-Z0-9 _.-]/g, '').trim();

        const baseDir = require.main ? dirname(require.main.filename) : process.cwd();
        const fullpath = resolve(baseDir, subpath || '', sanitizedFilename);

        if (!existsSync(fullpath)) {
            throw new Error(`File not found: ${fullpath}`);
        }

        const result = readFileSync(fullpath, 'utf-8');

        return result;
    } catch (err) {
        loggerHelper.error({
            source: 'helpers:file:getContent',
            message: err?.message || 'Failed to get file content',
            error: err
        });

        return null;
    }
};

/**
 * Write data to file safely with auto-directory creation
 * @param {string} filename - Target file name
 * @param {string} data - Content to write
 * @param {string} [subpath] - Optional sub-directory path
 * @returns {boolean} True if successful, false otherwise
 */
exports.putContent = (filename = '', data = '', subpath = '') => {
    try {
        if (isEmpty(filename) || isEmpty(data)) {
            throw new Error('Filename or data cannot be empty');
        }

        if (filename.includes('..')) {
            throw new Error('Invalid filename: Directory traversal is not allowed');
        }

        // Sanitize filename to prevent directory traversal
        const sanitizedFilename = filename.replace(/[^a-zA-Z0-9 _.-]/g, '').trim();

        const baseDir = require.main ? dirname(require.main.filename) : process.cwd();
        const dirPath = resolve(baseDir, subpath || '');

        if (!existsSync(dirPath)) {
            mkdirSync(dirPath, { mode: 0o777, recursive: true });
        }

        const fullpath = resolve(dirPath, sanitizedFilename);

        writeFileSync(fullpath, data, 'utf8');

        return true;
    } catch (err) {
        loggerHelper.error({
            source: 'helpers:file:putContent',
            message: err?.message || 'Failed to put file content',
            error: err
        });

        return false;
    }
};

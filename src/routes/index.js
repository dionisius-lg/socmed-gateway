const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const responseHelper = require('./../helpers/response');
const fileHelper = require('./../helpers/file');

const { readdirSync, statSync } = fs;
const { getContent } = fileHelper;
const basename = path.basename(__filename);

// Application root route
router.get('/', (req, res) => {
    let title = 'Gateway';

    try {
        const pkg = JSON.parse(getContent('package.json'));

        if (pkg.name && typeof pkg.name === 'string') {
            // split the string into an array by hyphens, capitalize the first letter of each word, join the words with a space
            title = pkg.name
                .split('-')
                .map((w) => (w === 'api' ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
                .join(' ');
        }
    } catch {
        // do nothing
    }

    return responseHelper.sendSuccess(res, {
        app: title
    });
});

// Dynamically load and mount route files
readdirSync(__dirname)
    .filter((file) => {
        return file !== basename && path.extname(file) === '.js' && statSync(path.join(__dirname, file)).isFile();
    })
    .forEach((file) => {
        const filename = path.parse(file).name;
        router.use(`/${filename}`, require(`./${filename}`));
    });

// Handle non-existing routes (404 Not Found)
router.use((req, res, _next) => {
    responseHelper.sendNotFound(res);
});

module.exports = router;

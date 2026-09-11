const swagger = require('swagger-ui-express');
const path = require('path');
const fs = require('fs');
const config = require('./index');
const fileHelper = require('./../helpers/file');
const valueHelper = require('./../helpers/value');

/**
 * Dynamically construct OpenAPI 3.0.0 documentation from swagger directory files
 * @returns {Object} OpenAPI document specification
 */
const buildBaseSwaggerDocument = () => {
    let pkg;

    try {
        pkg = JSON.parse(fileHelper.getContent('package.json')) || {};
    } catch {
        pkg = {};
    }

    const title = pkg?.name
        ? pkg.name
              .split('-')
              .map((w) => (w === 'api' ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
              .join(' ')
        : 'API Documentation';

    const tags = [];
    const paths = {};
    const swaggerDir = path.resolve(__dirname, '../../swagger');

    if (fs.existsSync(swaggerDir)) {
        const files = fs.readdirSync(swaggerDir).filter((file) => file.includes('.') && ['.js'].includes(path.extname(file)));

        files.forEach((file) => {
            let data;

            try {
                data = require(path.resolve(swaggerDir, file));
            } catch {
                data = [];
            }

            if (!valueHelper.isEmpty(data)) {
                const pathname = path.parse(file).name;
                const tagname = pathname.replace(/_/g, ' ');

                if (!tags.some((tag) => tag.name === tagname)) {
                    tags.push({ name: tagname });
                }

                data.forEach((row) => {
                    if (row?.method) {
                        Object.keys(row.method).forEach((methodType) => {
                            if (row.method[methodType]) {
                                row.method[methodType].tags = [tagname];
                                row.method[methodType].responses = {
                                    200: { description: 'Success OK' },
                                    400: { description: 'Bad Request' },
                                    401: { description: 'Unauthorized' },
                                    404: { description: 'Not Found' },
                                    500: { description: 'Internal Server Error' }
                                };
                            }
                        });
                    }

                    const routePath = row.path === '/' ? `/${pathname}` : `/${pathname}${row.path}`;
                    paths[routePath] = row.method;
                });
            }
        });
    }

    return {
        openapi: '3.0.0',
        info: {
            title: title,
            description: pkg?.description || '',
            version: pkg?.version || '1.0.0'
        },
        components: {
            securitySchemes: {
                apiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'x-api-key'
                }
            }
        },
        tags,
        paths
    };
};

// Base dokumen hanya di-generate satu kali di memory
const baseSwaggerDocument = buildBaseSwaggerDocument();

/**
 * Dynamic setup middleware
 */
const dynamicSwaggerSetup = (req, res, next) => {
    const { protocol, hostname } = req;
    const servers = [];
    const proxyPath = config?.proxy_path ? `/${config.proxy_path.replace(/^\/+|\/+$/g, '')}` : '';

    if (valueHelper.isDomainAddress(hostname) && hostname !== 'localhost') {
        servers.push({
            url: `https://${hostname}${proxyPath}`
        });
    } else {
        servers.push({
            url: `${protocol}://${hostname}:${config.port}`
        });
    }

    // Clone base document dan inject server dinamis
    const swaggerDocument = {
        ...baseSwaggerDocument,
        servers
    };

    return swagger.setup(swaggerDocument, {
        swaggerOptions: {
            validatorUrl: null,
            filter: false
        },
        customCss: '.swagger-ui .topbar { display: none !important; }',
        customSiteTitle: baseSwaggerDocument.info.title || 'API Documentation'
    })(req, res, next);
};

module.exports = {
    serve: swagger.serve,
    setup: dynamicSwaggerSetup
};

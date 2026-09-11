const express = require('express');
const compression = require('compression');
const config = require('./src/config');
const messageQueue = require('./src/config/message-queue');
const swaggerConfig = require('./src/config/swagger');
const loggerHelper = require('./src/helpers/logger');
const responseHelper = require('./src/helpers/response');
const rateLimiter = require('./src/middleware/rate-limiter');
const router = require('./src/routes');

const app = express();

// Compress HTTP responses
app.use(compression());
// Enable JSON body parsing
app.use(express.json({ limit: '50mb' }));
// Enable URL-encoded body parsing
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
// Apply rate limiter middleware
app.use(rateLimiter({ windowMs: 60 * 1000, max: 100 }));
// Serve static files
app.use('/public', express.static('public', { index: false }));
// Mount Swagger documentation
app.use('/api-docs', swaggerConfig.serve, swaggerConfig.setup);
// Setup HTTP access logging
loggerHelper.access(app);
// Handle JSON syntax errors gracefully
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError) {
        loggerHelper.error({
            source: 'app',
            message: `Syntax error! ${req.method} ${req.path} ${err?.message}`
        });

        return responseHelper.sendBadRequest(res, err?.message || '');
    }

    next(err);
});
// Mount application routes
app.use(router);
// Global catch-all error handler
app.use((err, req, res, _next) => {
    loggerHelper.error({
        source: 'app:global',
        message: err?.message || 'Unhandled Server Error',
        error: err
    });

    return responseHelper.sendInternalServerError(res);
});
// Disable X-Powered-By header for security
app.disable('x-powered-by');

(async () => {
    try {
        // Initialize message queue connection
        await messageQueue.init();

        // Start HTTP server
        const server = app.listen(config.port, '0.0.0.0', (err) => {
            if (err) {
                loggerHelper.error({
                    source: 'app',
                    message: `Server error! ${err.message}`
                });

                process.exit(1);
            }

            loggerHelper.debug({
                source: 'app',
                message: `Server is running for ${config.env} environment on port ${config.port}`
            });
        });

        // Graceful shutdown handling
        const gracefulShutdown = async () => {
            loggerHelper.event({
                source: 'app',
                message: 'Received kill signal, shutting down gracefully...'
            });

            server.close(async () => {
                loggerHelper.event({
                    source: 'app',
                    message: 'Closed out remaining connections'
                });

                try {
                    await messageQueue.close();

                    loggerHelper.event({
                        source: 'app',
                        message: 'Message queue connections closed'
                    });
                    process.exit(0);
                } catch (err) {
                    loggerHelper.error({
                        source: 'app',
                        message: `Error during shutdown: ${err.message}`
                    });
                    process.exit(1);
                }
            });

            setTimeout(() => {
                loggerHelper.error({
                    source: 'app',
                    message: 'Could not close connections in time, forcefully shutting down'
                });
                process.exit(1);
            }, 10000);
        };

        process.on('SIGTERM', gracefulShutdown);
        process.on('SIGINT', gracefulShutdown);
    } catch (err) {
        loggerHelper.error({
            source: 'app',
            message: `Server error! ${err.message}`
        });

        process.exit(1);
    }
})();

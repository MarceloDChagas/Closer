"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const PrismaClientExceptionFilter_1 = require("./filters/PrismaClientExceptionFilter");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    try {
        logger.log('Starting application...');
        const app = await core_1.NestFactory.create(app_module_1.AppModule, {
            logger: ['error', 'warn', 'log', 'debug', 'verbose'],
        });
        app.enableCors();
        app.useGlobalPipes(new common_1.ValidationPipe());
        app.useGlobalFilters(new PrismaClientExceptionFilter_1.PrismaClientExceptionFilter());
        const port = process.env.PORT ?? 3040;
        logger.log(`Attempting to start server on port ${port}...`);
        await app.listen(port);
        logger.log('=================================');
        logger.log(`SERVER RUNNING ON PORT ${port}`);
        logger.log(`API: http://localhost:${port}`);
        logger.log('=================================');
        process.on('SIGTERM', () => {
            logger.log('SIGTERM received. Shutting down gracefully...');
            app.close();
        });
    }
    catch (error) {
        logger.error('Failed to start application:', error);
        process.exit(1);
    }
}
bootstrap().catch((err) => {
    console.error('Unhandled error during bootstrap:', err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map
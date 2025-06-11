"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const PrismaClientExceptionFilter_1 = require("./filters/PrismaClientExceptionFilter");
async function bootstrap() {
    const logger = new common_1.Logger();
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.useGlobalFilters(new PrismaClientExceptionFilter_1.PrismaClientExceptionFilter());
    await app.listen(process.env.PORT ?? 3006);
    logger.log(`Server is running on port ${process.env.PORT ?? 3000}`);
}
bootstrap();
//# sourceMappingURL=main.js.map
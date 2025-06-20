"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const HttpExceptionFilter_1 = require("./filters/HttpExceptionFilter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));
    app.useGlobalFilters(new HttpExceptionFilter_1.HttpExceptionFilter());
    const port = process.env.PORT || 3008;
    await app.listen(port);
    console.log(`=================================`);
    console.log(`SERVER RUNNING ON PORT ${port}`);
    console.log(`API: http://localhost:${port}`);
    console.log(`=================================`);
}
bootstrap();

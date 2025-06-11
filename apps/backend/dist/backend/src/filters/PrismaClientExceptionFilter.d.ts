import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
export declare class PrismaClientExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost): void;
}

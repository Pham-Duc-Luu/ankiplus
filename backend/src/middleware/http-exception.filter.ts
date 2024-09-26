import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { WinstonLogger } from 'src/logger/winston.config';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception?.getStatus();
        const logger = new WinstonLogger()
            .addTransportConsole()
            .addTransportDailyRotateFile()

            .build();
        logger.error(JSON.stringify(exception) + '\n');

        response.status(status).json(exception);
    }
}

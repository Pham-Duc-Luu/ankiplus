import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Inject, Injectable } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request, Response } from 'express';
import Logger, { LoggerKey } from 'libs/logger/logger/domain/logger';
import FileTransport from 'libs/logger/logger/infrastructure/winston/transports/fileTransport';
import WinstonLogger from 'libs/logger/logger/infrastructure/winston/winstonLogger';

@Catch(HttpException)
@Injectable()
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(@Inject(LoggerKey) private logger: Logger) {}
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception?.getStatus();
        // const logger = new WinstonLogger()
        //     .addTransportConsole()
        //     .addTransportDailyRotateFile()

        //     .build();
        // logger.error(JSON.stringify(exception) + '\n');
        this.logger.error(JSON.stringify(exception, null, 4));
        response.status(status).json(exception);
    }
}

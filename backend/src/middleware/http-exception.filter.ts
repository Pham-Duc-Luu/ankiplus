import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Inject, Injectable, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { GqlArgumentsHost } from '@nestjs/graphql';
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
        const status = exception.getStatus ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR; // const logger = new WinstonLogger()
        //     .addTransportConsole()
        //     .addTransportDailyRotateFile()

        //     .build();
        // logger.error(JSON.stringify(exception) + '\n');

        // Check if the request is for GraphQL
        const gqlHost = GqlArgumentsHost.create(host);
        const isGraphQL = gqlHost.getType().toString() === 'graphql';

        const errorResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request?.url,
            message: exception.message || 'Internal server error',
        };
        if (isGraphQL) {
            // For GraphQL, just throw the exception directly.
            return exception;
        }

        this.logger.error(JSON.stringify(exception, null, 4));
        response.status(status).json(exception);
    }
}

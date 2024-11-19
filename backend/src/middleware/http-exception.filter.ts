import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Inject, Injectable, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { Request, Response } from 'express';
import Logger, { LoggerKey } from 'libs/logger/logger/domain/logger';
import FileTransport from 'libs/logger/logger/infrastructure/winston/transports/fileTransport';
import WinstonLogger from 'libs/logger/logger/infrastructure/winston/winstonLogger';
import * as _ from 'lodash';

const formatErrorMessage = (message: string | string[]): string => {
    if (_.isString(message)) {
        // If it's a string, return it directly
        return message;
    }

    if (_.isArray(message)) {
        // If it's an array of strings, capitalize and join them
        return message.map((msg) => _.capitalize(msg)).join('. ') + '.';
    }

    return ''; // Return an empty string if it's neither a string nor an array
};

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

        const validateErrorMessage = Object(exception.getResponse()).message as string | string[];

        const errorResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request?.url,
            message: formatErrorMessage(validateErrorMessage) || exception.message || 'Internal server error',
        };
        if (isGraphQL) {
            // For GraphQL, just throw the exception directly.
            return exception;
        }

        this.logger.error(JSON.stringify(exception, null, 4));
        response.status(status).json(errorResponse);
    }
}

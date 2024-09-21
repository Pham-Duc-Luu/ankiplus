import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { WinstonLogger } from 'src/logger/winston.config';
import winston from 'winston';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest<Request>();
        const res = context.switchToHttp().getResponse<Response>();
        const now = Date.now();
        console.log('a');

        return next.handle().pipe(
            //   map((data) => {
            //       console.log(`Response data: ${JSON.stringify(data)}`); // Log the response data
            //       return data; // Return the data (this will be sent back to the client)
            //   }),
            tap(() => {
                const logger = new WinstonLogger().addTransportConsole().build();
                logger.info(`${req.method} ${req.url}`);
            }), // Log the time taken
        );
    }
}

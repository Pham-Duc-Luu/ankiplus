import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Response } from 'express';
import morgan from 'morgan';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import winston, { level } from 'winston';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest<Request>();
        const res = context.switchToHttp().getResponse<Response>();
        const now = Date.now();

        return next.handle().pipe(
            //   map((data) => {
            //       console.log(`Response data: ${JSON.stringify(data)}`); // Log the response data
            //       return data; // Return the data (this will be sent back to the client)
            //   }),
            tap(() => {
                // morgan('combined')(req, res, next);
                // const logger = new WinstonLogger().addTransportConsole().build();
                // logger.info('Info message');
                // logger.error('Error message');
                // logger.warn('Warning message');
            }), // Log the time taken
        );
    }
}

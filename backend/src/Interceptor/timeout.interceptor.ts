import { CallHandler, ExecutionContext, Injectable, NestInterceptor, RequestTimeoutException } from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
    constructor(private readonly requestTimeout: number = 5000) {} // Default 5 seconds

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            timeout(this.requestTimeout), // Set the request timeout
            catchError((err) => {
                if (err instanceof TimeoutError) {
                    return throwError(() => new RequestTimeoutException('Request timed out'));
                }
                return throwError(() => err);
            }),
        );
    }
}

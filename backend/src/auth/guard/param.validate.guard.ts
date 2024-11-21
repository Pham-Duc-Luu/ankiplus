import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { isNumber } from 'class-validator';
import { QueryOptionDto } from 'dto/query-option.dto';
import { Observable } from 'rxjs';

@Injectable()
export class ParamValidate implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        // Extract params, body, and query from the request
        const query = request.query as Partial<QueryOptionDto>;

        // Verify query's limit
        if (query.limit && isNaN(query.limit)) {
            throw new BadRequestException('Invalid limit query parameter');
        }

        if (query.skip && isNaN(query.skip)) {
            throw new BadRequestException('Invalid skip query parameter');
        }

        return true; // Allow the request if no NaN found
    }
}

import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
    protected getRequest(context: ExecutionContext) {
        const gqlCtx = GqlExecutionContext.create(context);
        const ctx = gqlCtx.getContext();

        return ctx.req; // Handle HTTP or GraphQL
    }

    protected getResponse(context: ExecutionContext) {
        const gqlCtx = GqlExecutionContext.create(context);
        const ctx = gqlCtx.getContext();
        return ctx.res; // Handle HTTP or GraphQL
    }
    // getRequestResponse(context: ExecutionContext) {
    //     const gqlCtx = GqlExecutionContext.create(context);
    //     const ctx = gqlCtx.getContext();
    //     return { req: ctx.req, res: ctx.res };
    // }
}

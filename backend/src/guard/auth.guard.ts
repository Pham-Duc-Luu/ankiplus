import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException('Missing token');
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get('jwtConstant.public.key'),
            });
            // 💡 We're assigning the payload to the request object here
            // so that we can access it in our route handlers

            request['user'] = payload;
        } catch {
            throw new UnauthorizedException('Access token expired!');
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}

@Injectable()
export class AuthGuardGraphqlServer implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Check if we're in GraphQL context
        const ctx = GqlExecutionContext.create(context);
        const request = ctx.getContext().req || context.switchToHttp().getRequest(); // Use correct context for GraphQL or HTTP

        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException('Missing token');
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('jwtConstant.public.key'),
            });
            // Attach the payload (user) to the request object or GraphQL context
            request['user'] = payload;
        } catch {
            throw new UnauthorizedException('Access token expired!');
        }
        return true;
    }

    private extractTokenFromHeader(request: any): string | undefined {
        const authorizationHeader = request.headers?.authorization;
        if (!authorizationHeader) {
            return undefined;
        }
        const [type, token] = authorizationHeader.split(' ');
        return type === 'Bearer' ? token : undefined;
    }
}

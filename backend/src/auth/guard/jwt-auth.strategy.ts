import { ExecutionContext, Inject, Injectable, Logger } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { LoggerKey } from 'libs/logger/logger/domain/logger';

@Injectable()
export class JwtGuardStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: NestConfigService,
        @Inject(LoggerKey) private logger: Logger,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('client.frontend.url'),
        });
    }

    async validate(payload: any) {
        return payload;
    }
}

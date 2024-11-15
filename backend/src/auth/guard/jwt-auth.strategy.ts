import { ExecutionContext, Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class JwtGuardStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: NestConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('client.frontend.url'),
        });
    }

    async validate(payload: any) {
        console.log('payload', payload);
        return payload;
    }
}

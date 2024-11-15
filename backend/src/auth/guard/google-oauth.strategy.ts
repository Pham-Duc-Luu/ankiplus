import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { log } from 'winston';
import { configDotenv } from 'dotenv';
configDotenv();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private configService: ConfigService) {
        super({
            clientID:
                configService.get<string>('oauth2.provider.google.clientId') ||
                process.env.GOOGLE_CLIENT_ID ||
                'google-id',
            clientSecret:
                configService.get<string>('oauth2.provider.google.clientSecret') ||
                process.env.GOOGLE_CLIENT_SECRET ||
                'google-secret',

            callbackURL:
                configService.get<string>('oauth2.provider.google.callbackURL') ||
                process.env.CALLBACK_URL ||
                'http://localhost:5000/auth/google/callback',
            scope: ['profile', 'email'],
        });
        log;
    }

    async validate(_accessToken: string, _refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const { id, name, emails, photos } = profile;

        const user = {
            provider: 'google',
            providerId: id,
            email: emails[0].value,
            name: `${name.givenName} ${name.familyName}`,
            picture: photos[0].value,
        };

        done(null, user);
    }
}

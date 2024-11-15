import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtGuardStrategy } from './guard/jwt-auth.strategy';
import { JwtGuard } from './guard/jwt-auth.guard';
import { GoogleStrategy } from './guard/google-oauth.strategy';

@Module({
    imports: [
        JwtModule.registerAsync({
            global: true,
            useFactory: async (configService: ConfigService) => {
                return {
                    secret: configService.get<string>('jwtConstant.secret'),
                    // signOptions: { expiresIn: configService.get<string>('jwtConstant.expiresIn') },
                };
            },
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtGuardStrategy, JwtGuard, GoogleStrategy],
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtGuardStrategy } from './guard/jwt-auth.strategy';
import { JwtGuard } from './guard/jwt-auth.guard';
import { GoogleStrategy } from './guard/google-oauth.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'schemas/user.schema';
import { Collection, CollectionSchema } from 'schemas/collection.schema';
import { FlashCard, FlashCardSchema } from 'schemas/flashCard.schema';
import { Token, TokenSchema } from 'schemas/token.schema';
import configuration from ' config/configuration';
import { UserService } from 'src/user/user.service';

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                { name: User.name, schema: UserSchema },
                { name: Collection.name, schema: CollectionSchema },
                { name: FlashCard.name, schema: FlashCardSchema },
                { name: Token.name, schema: TokenSchema },
            ],
            configuration().database.mongodb_main.name,
        ),
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
    providers: [AuthService, GoogleStrategy, UserService],
})
export class AuthModule {}

import {
    Controller,
    Get,
    Req,
    Res,
    UseGuards,
    Injectable,
    Inject,
    InternalServerErrorException,
    BadRequestException,
    HttpException,
    Post,
    Body,
    Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GoogleOauthGuard } from './guard/google-oauth.guard';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import Logger, { LoggerKey } from 'libs/logger/logger/domain/logger';
import LoggerService from 'libs/logger/logger/domain/loggerService';
import { IOAuthGoogleUser } from 'dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { InjectModel } from '@nestjs/mongoose';
import configuration from ' config/configuration';
import { User } from 'schemas/user.schema';
import { Model } from 'mongoose';
import { jwtPayloadDto, JWTTokenDto } from 'dto/jwt.dto';
import { ConfigService } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { OAuth2Client } from 'google-auth-library';
import { Token } from 'schemas/token.schema';
dotenvConfig({});
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, 'postmessage');

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        @Inject(LoggerKey) private logger: Logger,
        private jwtService: JwtService,
        private userService: UserService,
        @InjectModel(Token.name, configuration().database.mongodb_main.name) private tokenModel: Model<Token>,
        private configService: ConfigService,
        @InjectModel(User.name, configuration().database.mongodb_main.name) private userModel: Model<User>,
    ) {}

    @Get('google/callback')
    @UseGuards(GoogleOauthGuard)
    async googleAuthCallback(@Req() req: Request & { user?: IOAuthGoogleUser }, @Res() res: Response) {
        try {
            if (!req.user) {
                throw new BadRequestException('User not found');
            }

            const { email, name } = req.user;
            const existUser = await this.userModel.findOne({ email: email });

            let payload: jwtPayloadDto;
            if (!existUser) {
                const newUser = await this.userModel.create({
                    email: email,
                    username: name,
                });
                payload = {
                    sub: newUser.id,
                    email: newUser.email,
                };
            } else {
                payload = {
                    sub: existUser._id.toString(),
                    email: existUser.email,
                };
            }

            const refresh_token = await this.userService.getRefreshToken(payload);
            const access_token = await this.userService.getAccessToken(payload);
            const jwtDto: JWTTokenDto = { refresh_token, access_token };
            res.redirect(`${this.configService.get('client.frontend.url')}/oauth?token=${JSON.stringify(jwtDto)}`);
        } catch (err) {
            this.logger.error(err);
            if (err instanceof HttpException) {
                throw err;
            }
            return new InternalServerErrorException();
        }
    }

    @Post('google/verify')
    async googleVerify(@Body() { token }: { token: string }) {
        try {
            const { tokens } = await client.getToken(token);

            // Verify the ID token
            const ticket = (
                await client.verifyIdToken({
                    idToken: tokens.id_token,
                    audience: process.env.GOOGLE_CLIENT_ID, // Your Google client ID
                })
            ).getPayload();

            let user = await this.userModel.findOne({ email: ticket.email });
            let payload: jwtPayloadDto;

            // Check if the user is already signed
            if (!user) {
                user = await this.userModel.create({
                    email: ticket.email,
                    username: ticket.given_name + ticket.family_name,
                    isGoogleUser: true,
                });

                payload = {
                    sub: user.id,
                    email: user.email,
                };
            } else {
                payload = {
                    sub: user._id.toString(),
                    email: user.email,
                };
            }

            const refresh_token = await this.userService.getRefreshToken(payload);
            const access_token = await this.userService.getAccessToken(payload);

            /**
             * * save the token
             */
            const new_token = await this.tokenModel.create({ token: refresh_token, user_token: user._id });
            user.Tokens.push(new_token);
            await user.save();

            /**
             * * with the jwt
             * @returns {access_token, refresh_token}
             */
            return { access_token, refresh_token };
        } catch (error) {
            this.logger.error(error);
            return new InternalServerErrorException();
        }
    }
}

import {
    Controller,
    Get,
    Param,
    Post,
    Req,
    UseGuards,
    Request,
    Body,
    HttpException,
    BadRequestException,
    UnauthorizedException,
    HttpStatus,
    Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'dto/create-user.dto';
import { jwtPayloadDto } from 'dto/jwt-payload.dto';
import { LoginUserDto } from 'dto/login-user.dto';
import { Model } from 'mongoose';
import { Collection } from 'schemas/collection.schema';
import { FlashCard } from 'schemas/flashCard.schema';
import { User } from 'schemas/user.schema';
import { AuthGuard } from 'src/auth/auth.guard';
import { WinstonLoggerService } from 'src/logger/logger.service';
import { UtilService } from 'src/util/util.service';
import { UserService } from './user.service';
import { JWTTokenDto } from 'dto/jwt-token';
import { ConfigService } from '@nestjs/config';
import { Token } from 'schemas/token.schema';
import { ObjectId } from 'mongodb';
import Logger, { LoggerKey } from 'libs/logger/logger/domain/logger';
import LoggerService from 'libs/logger/logger/domain/loggerService';

@Controller('')
export class UserController {
    constructor(
        @Inject(LoggerKey) private logger: Logger,
        private util: UtilService,
        private userService: UserService,
        private jwtService: JwtService,
        private configService: ConfigService,

        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Token.name) private tokenModel: Model<Token>,
    ) {}

    @ApiTags('Authentications')
    @Post('/sign-up')
    async create(@Body() createUser: CreateUserDto) {
        const { email, password, username } = createUser;
        if (!email || !password || !username) {
            throw new HttpException('Missing email, password or username', HttpStatus.BAD_REQUEST);
        }

        // * validate email and password format
        if (!this.util.validateEmail(email)) {
            throw new BadRequestException('Invalid email');
        }
        if (!this.util.validatePassword(password)) {
            throw new BadRequestException('Invalid password');
        }

        // * check if email or username have been use
        const existUser = await this.userModel.findOne({
            $or: [{ email: email }, { username: username }],
        });
        if (existUser) {
            throw new BadRequestException('Email or username already');
        }

        // * create a new user
        const newUser = await this.userModel.create({
            email,
            username,
            password: this.util.hashSync(password),
        });
        const payload: jwtPayloadDto = {
            sub: newUser.id,
            email: newUser.email,
        };

        const refresh_token = await this.userService.getRefreshToken(payload);
        const access_token = await this.userService.getAccessToken(payload);

        /**
         * * save the token
         */

        const new_token = await this.tokenModel.create({ token: refresh_token, user_token: newUser._id });
        newUser.Tokens.push(new_token);
        await newUser.save();

        /**
         * * with the jwt
         * @returns {access_token, refresh_token}
         */
        return {
            access_token,
            refresh_token,
        };
    }

    @ApiTags('Authentications')
    @Post('/sign-in')
    async findUser(@Body() loginProperty: LoginUserDto) {
        const { email, password } = loginProperty;
        if (!email || !password) {
            throw new BadRequestException('Missing email or password');
        }

        const user = await this.userModel.findOne({ email: email });
        if (!user) {
            throw new BadRequestException('User not found');
        }

        if (!this.util.compareSync(password, user.password)) {
            throw new BadRequestException('Wrong password!');
        }

        const payload: jwtPayloadDto = {
            sub: user.id,
            email: user.email,
        };

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
        return {
            access_token,
            refresh_token,
        };
    }

    @ApiTags('Authentications')
    @Post('/refresh-token')
    async refreshToken(@Body() { access_token, refresh_token }: JWTTokenDto) {
        if (!access_token || !refresh_token) {
            throw new BadRequestException('Missing token');
        }

        try {
            const accessPayload = await this.jwtService.verify(access_token, {
                secret: this.configService.get('jwtConstant.public.key'),
                ignoreExpiration: true,
            });

            const refreshPayload = await this.jwtService.verify(refresh_token, {
                secret: this.configService.get('jwtConstant.secret.key'),
            });

            const existToken = await this.tokenModel.find({ user_token: new ObjectId(accessPayload.sub) });

            if (existToken.find((token) => token.token === refresh_token).user_token.toString() === accessPayload.sub) {
                const payload: jwtPayloadDto = {
                    sub: accessPayload.sub,
                    email: accessPayload.email,
                };

                const newAccessToken = await this.userService.getAccessToken(payload);

                /**
                 * * with the jwt
                 * @returns {access_token, refresh_token}
                 */
                return {
                    access_token: newAccessToken,
                    refresh_token,
                };
            }

            throw new UnauthorizedException('Invalid refresh token');
        } catch (error) {
            throw new UnauthorizedException();
        }
    }
}

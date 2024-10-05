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
    Logger,
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

@Controller('')
export class UserController {
    constructor(
        private readonly logger: WinstonLoggerService,
        private util: UtilService,
        private userService: UserService,
        private jwtService: JwtService,
        @InjectModel(User.name) private userModel: Model<User>,
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

        /**
         * * with the jwt
         * @returns {access_token, refresh_token}
         */
        return {
            access_token: await this.userService.getAccessToken(payload),
            refresh_token: await this.userService.getRefreshToken(payload),
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

        /**
         * * with the jwt
         * @returns {access_token, refresh_token}
         */
        return {
            access_token: await this.userService.getAccessToken(payload),
            refresh_token: await this.userService.getRefreshToken(payload),
        };
    }
}

import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Inject,
    InternalServerErrorException,
    NotFoundException,
    Post,
    Query,
    Req,
    Request,
    UnauthorizedException,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { ApiTags } from '@nestjs/swagger';

import { Model } from 'mongoose';
import { Collection, CollectionDocument } from 'schemas/collection.schema';
import { FlashCard } from 'schemas/flashCard.schema';
import { User } from 'schemas/user.schema';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { UtilService } from 'src/util/util.service';
import { UserAuthService, UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { Token } from 'schemas/token.schema';
import { ObjectId } from 'mongodb';
import Logger, { LoggerKey } from 'libs/logger/logger/domain/logger';
import { QueryOptionDto } from 'dto/query-option.dto';
import { ListResponseDto } from 'dto/ListResponse.dto';
import { pickFields } from 'utils/utils';
import configuration from ' config/configuration';
import { CreateUserDto, LoginUserDto, ResetPasswordDto, SendOtpDto, UserProfileDto } from 'dto/user.dto';
import { jwtPayloadDto, JWTTokenDto } from 'dto/jwt.dto';
import { Request as ExpressRequest } from 'express';
import { AUTHENTICATION } from 'dto/ApiTag.dto';
import * as otpGen from 'otp-generator';
import { MailerService } from './mailer.service';
import * as dayjs from 'dayjs';
@Controller('')
export class UserController {
    constructor(
        @Inject(LoggerKey) private logger: Logger,
        private util: UtilService,
        private userService: UserService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private mailerService: MailerService,
        @InjectModel(User.name, configuration().database.mongodb_main.name) private userModel: Model<User>,
        @InjectModel(Token.name, configuration().database.mongodb_main.name) private tokenModel: Model<Token>,
    ) {}

    @ApiTags(AUTHENTICATION, 'User')
    @Post('/sign-up')
    async create(@Body() createUser: CreateUserDto) {
        const { email, password, username } = createUser;
        if (!email || !password || !username) {
            throw new HttpException('Missing email, password or username', HttpStatus.BAD_REQUEST);
        }

        // // * validate email and password format
        // if (!this.util.validateEmail(email)) {
        //     throw new BadRequestException('Invalid email');
        // }
        // if (!this.util.validatePassword(password)) {
        //     throw new BadRequestException('Invalid password');
        // }

        // * check if email or username have been use
        const existUser = await this.userModel.findOne({
            $or: [{ email: email }, { username: username }],
        });
        if (existUser) {
            throw new BadRequestException('Email or username has already been used');
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

    @ApiTags(AUTHENTICATION, 'User')
    @Post('/sign-in')
    async findUser(@Body() loginProperty: LoginUserDto): Promise<JWTTokenDto> {
        try {
            const { email, password } = loginProperty;
            if (!email || !password) {
                throw new BadRequestException('Missing email or password');
            }

            const user = await this.userModel.findOne({ email: email });
            if (!user) {
                throw new BadRequestException('User not found');
            }

            // * check if the user's password exists
            if (!user.password) throw new BadRequestException('Password not found');

            // * check if the password is correct
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
            return new JWTTokenDto(access_token, refresh_token);
        } catch (error) {
            this.logger.error(error);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException();
        }
    }

    @ApiTags(AUTHENTICATION)
    @Post('/refresh-token')
    async refreshToken(
        @Body() { access_token, refresh_token }: JWTTokenDto,
        @Req() req: ExpressRequest,
    ): Promise<JWTTokenDto> {
        if (!access_token || !refresh_token) {
            throw new BadRequestException('Missing token');
        }

        try {
            const accessPayload = await this.jwtService.verify(access_token, {
                secret: this.configService.get('jwtConstant.public.key'),
                ignoreExpiration: true,
            });

            const existToken = await this.tokenModel.find({
                user_token: new ObjectId(accessPayload.sub),
                token: refresh_token,
            });

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

                return new JWTTokenDto(newAccessToken, refresh_token);
            } else {
                throw new UnauthorizedException('Invalid refresh token');
            }
        } catch (error) {
            this.logger.error(error);
            throw new UnauthorizedException();
        }
    }

    @ApiTags(AUTHENTICATION)
    @Post('/reset-password/send-otp')
    async sendOTP(@Body() { email }: SendOtpDto) {
        try {
            if (!email) {
                throw new BadRequestException('Email is required');
            }
            // Check if the email is valid
            const existUser = await this.userModel.findOne({ email });

            if (!existUser) throw new BadRequestException('The email does not exist');

            const otp = otpGen.generate(6, { upperCaseAlphabets: false, specialChars: false });

            existUser.resetPasswordToken = otp;
            existUser.resetPasswordExpires = dayjs().add(60, 'second').toDate();

            // Send OTP via email
            this.mailerService.sendEmail({
                from: 'Ankiplus',
                to: email,
                subject: 'Reset Password OTP',
                html: `<p>Your OTP code is: <strong>${otp}</strong></p><p>It is valid for 60 second.</p>`,
            });

            await existUser.save();

            return 'OTP has sent to your email';
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            this.logger.error(error);
            throw new InternalServerErrorException();
        }
    }

    @ApiTags(AUTHENTICATION)
    @Post('/reset-password')
    async resetPassword(@Body() { email, password, otp }: ResetPasswordDto) {
        try {
            if (!email || !password || !otp) {
                throw new BadRequestException('Email, password and otp are required');
            }
            // Check if the email is valid
            const existUser = await this.userModel.findOne({ email });

            if (!existUser) throw new NotFoundException('The email does not exist');

            if (dayjs().isAfter(existUser.resetPasswordExpires) || existUser.resetPasswordToken !== otp) {
                throw new BadRequestException('Invalid OTP or expired time');
            }

            existUser.password = this.util.hashSync(password);

            existUser.resetPasswordExpires = null;
            existUser.resetPasswordToken = null;
            await existUser.save();

            return 'ok';
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException();
        }
    }
}

@ApiTags('Users')
@UseGuards(AuthGuard)
// @UseGuards(ParamValidate)
@UsePipes(new ValidationPipe({ transform: true }))
@Controller('user')
export class UserAuthController {
    constructor(
        private util: UtilService,
        private jwtService: JwtService,
        private userAuthService: UserAuthService,
        @InjectModel(FlashCard.name, configuration().database.mongodb_main.name)
        private flashCardModel: Model<FlashCard>,
        @InjectModel(User.name, configuration().database.mongodb_main.name) private userModel: Model<User>,
        @InjectModel(Collection.name, configuration().database.mongodb_main.name)
        private collectionModel: Model<Collection>,
    ) {}

    // * get user details profile
    @Get('/profile')
    async getProfile(
        @Request() request: { user: jwtPayloadDto },
        @Query() { limit = 30, skip = 0, order = 'asc' }: QueryOptionDto,
    ): Promise<UserProfileDto<Pick<CollectionDocument, '_id' | 'name'>>> {
        const user = await this.userModel
            .findById({ _id: request.user.sub })
            .populate({
                path: 'collections', // Populate the `collections` field
                model: Collection.name, // Specify the model to populate from
                // select: 'id name createdAt',
                options: {
                    limit: limit,
                    skip: skip,
                    sort: { createdAt: order === 'asc' ? 1 : -1 },
                },
            })
            .select('email username');

        return new UserProfileDto<Pick<CollectionDocument, '_id' | 'name'>>({
            _id: user._id.toString(),
            email: user.email,
            username: user.username,
            collections: new ListResponseDto({
                data: await Promise.all(
                    user.collections.map(async (collectionId) => {
                        return pickFields(await this.collectionModel.findById(collectionId), ['_id', 'name']);
                    }),
                ),
                total: await this.userAuthService.getCollectionsLength(user._id.toString()),
                skip: skip,
                limit: limit,
            }),
        });
    }
}

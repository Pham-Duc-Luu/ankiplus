import configuration from ' config/configuration';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { jwtPayloadDto, JWTTokenDto } from 'dto/jwt.dto';
import { IOAuthGoogleUser } from 'dto/user.dto';
import { Model } from 'mongoose';
import { User } from 'schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { OAuth2Client } from 'google-auth-library';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig({
    path: '.env',
});
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
        @InjectModel(User.name, configuration().database.mongodb_main.name) private userModel: Model<User>,
    ) {}
    // async oAuthLogin(user: IOAuthGoogleUser) {
    //     if (!user) {
    //         throw new Error('User not found!!!');
    //     }

    //     //    .... your business logic
    //     const existUser = await this.userModel.findOne({ email: user.email });

    //     //   .... add whatever payload you want to have
    //     const payload: jwtPayloadDto = {
    //         email: user.email,
    //         sub: user.name,
    //     };

    //     return {};
    // }
    async googleRegistrationService(token: string) {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { email } = ticket.getPayload();

        let payload: jwtPayloadDto;
        const userExists = await this.userModel.findOne({
            where: {
                email: email,
            },
        });
        if (!userExists) {
            const newUser = await this.userModel.create({
                email: email,
                isGoogleUser: true,
            });

            payload = {
                sub: newUser.id,
                email: newUser.email,
            };
        } else {
            payload = {
                sub: userExists.id,
                email: userExists.email,
            };
        }

        const refresh_token = await this.userService.getRefreshToken(payload);
        const access_token = await this.userService.getAccessToken(payload);

        return { access_token, refresh_token };
    }
}

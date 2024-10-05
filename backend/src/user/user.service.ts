import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'schemas/user.schema';
import { UtilService } from 'src/util/util.service';
import * as bcrypt from 'bcrypt';
import config from ' config/configuration';
@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService,
        private util: UtilService,
        private configService: ConfigService,
    ) {}

    async verifyRefreshToken(token: string, storedHash: string) {
        return bcrypt.compare(token, storedHash);
    }
    async hashRefreshToken(token: string) {
        const salt = await bcrypt.genSalt();
        return bcrypt.hash(token, salt); // Store this in your DB for verification later
    }
    async getAccessToken(payload: any) {
        return this.jwtService.sign(payload, {
            secret: this.configService.get('jwtConstant.public.key'),
            expiresIn: this.configService.get('jwtConstant.public.expiresIn'), // Short expiration time for access token
        });
    }

    async getRefreshToken(payload: any) {
        return this.jwtService.sign(payload, {
            secret: this.configService.get('jwtConstant.secret.key'),
            expiresIn: this.configService.get('jwtConstant.secret.expiresIn'), // Short expiration time for access token
        });
    }
}

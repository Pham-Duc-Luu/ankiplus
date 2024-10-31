import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from 'schemas/user.schema';
import { UtilService } from 'src/util/util.service';
import * as bcrypt from 'bcrypt';
import configuration from ' config/configuration';
import { Collection } from 'schemas/collection.schema';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name, configuration().database.mongodb_main.name) private userModel: Model<User>,
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

@Injectable()
export class UserAuthService {
    constructor(
        @InjectModel(Collection.name, configuration().database.mongodb_main.name)
        private collectionModel: Model<Collection>,
        // @InjectModel(FlashCard.name) private flashCardModel: Model<FlashCard>,
        @InjectModel(User.name, configuration().database.mongodb_main.name) private userModel: Model<User>,
        // private logger: LoggerService,
    ) {}

    /**
     * * get the user's collection's length
     */
    async getCollectionsLength(userId: string): Promise<number> {
        const result = await this.userModel.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(userId) } }, // Match the specific user
            {
                $project: {
                    collectionsCount: { $size: '$collections' }, // Get the size of the collections array
                },
            },
        ]);

        return result.length > 0 ? result[0].collectionsCount : 0;
    }

    async getCardslength(collectionId: string): Promise<number> {
        const result = await this.collectionModel.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(collectionId) } }, // Match the specific user
            {
                $project: {
                    flashcardsCount: { $size: '$cards' }, // Get the size of the collections array
                },
            },
        ]);

        return result.length > 0 ? result[0].flashcardsCount : 0;
    }
}

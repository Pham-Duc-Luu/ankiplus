import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import LoggerService from 'libs/logger/logger/domain/loggerService';
import mongoose, { Model } from 'mongoose';
import { Collection } from 'schemas/collection.schema';
import { FlashCard } from 'schemas/flashCard.schema';
import { User } from 'schemas/user.schema';

@Injectable()
export class UserAuthService {
    constructor(
        @InjectModel(Collection.name) private collectionModel: Model<Collection>,
        @InjectModel(FlashCard.name) private flashCardModel: Model<FlashCard>,
        @InjectModel(User.name) private userModel: Model<User>,

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
}

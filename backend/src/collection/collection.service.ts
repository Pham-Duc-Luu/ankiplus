import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'schemas/user.schema';
import { CreateUserDto } from '../../dto/user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Collection } from 'schemas/collection.schema';
import configuration from ' config/configuration';
import { FlashCard } from 'schemas/flashCard.schema';
import * as _ from 'lodash';
@Injectable()
export class CollectionService {
    constructor(
        @InjectModel(Collection.name, configuration().database.mongodb_main.name)
        private collectionModel: Model<Collection>,
        @InjectModel(FlashCard.name, configuration().database.mongodb_main.name)
        private flashCardModel: Model<FlashCard>,
    ) {}

    // * remove all of the card that not exist in collection
    async removeUnexistedFlashCards(collectionId: string) {
        // * query the collection
        const collection = await this.collectionModel.findById(collectionId);

        const existCard = [];
        // * loop through the flash cards and remove unexisted cards
        for (let index = 0; index < collection.cards.length; index++) {
            const cardId = collection.cards[index] as string;
            const flashCard = await this.flashCardModel.findById(cardId);

            if (flashCard) {
                existCard.push(flashCard._id);
            }
        }
        collection.cards = existCard;
        await collection.save();
    }
}

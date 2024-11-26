import { BadRequestException, Injectable } from '@nestjs/common';
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
import * as dayjs from 'dayjs';

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

    // * remove card'id in review session that is not exist in collection's card
    async removeUnexistedCardsInReviewSession(collectionId: string) {
        const collection = await this.collectionModel.findById(collectionId);
        if (!collection?.reviewSession || !collection.reviewSession.cards) {
            throw new BadRequestException('Review session not found');
        }

        // * initialize the card that exist
        const existCards = [];

        // * loop through the review session cards and remove unexisted cards
        collection.reviewSession.cards.forEach((cardId) => {
            if (
                _.findIndex(
                    collection?.cards.map((o) => o.toString()),
                    function (o) {
                        return o === cardId.toString();
                    },
                ) !== -1
            ) {
                existCards.push(cardId);
            }
        });

        // * update the review session cards
        collection.reviewSession.cards = existCards;
        await collection.save();
        return;
    }

    // * delete card that not yet expired
    async removeNotYetExpiredCardInReviewSession(collectionId: string) {
        const collection = await this.collectionModel.findById(collectionId);
        if (!collection?.reviewSession || !collection.reviewSession.cards) {
            throw new BadRequestException('Review session not found');
        }

        // * initialize today
        const today = dayjs();

        // * initialize the card that have nextreviewDate is before today
        const expectCard = [];

        // * loop through the review session cards and find all the cards that have nextreviewDate before today
        for (let index = 0; index < collection.reviewSession.cards.length; index++) {
            const cardid = collection.reviewSession.cards[index] as string;

            const flashcard = await this.flashCardModel.findById(cardid);
            if (!flashcard) {
                throw new BadRequestException('Card not found');
            }

            if (today.isAfter(flashcard.SRS.nextReviewDate)) {
                expectCard.push(cardid);
            }
        }

        collection.reviewSession.cards = expectCard;
        await collection.save();
    }
}

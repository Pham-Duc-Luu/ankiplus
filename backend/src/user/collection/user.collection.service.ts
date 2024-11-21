import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UtilService } from 'src/util/util.service';
import { UserAuthService } from '../user.service';
import { InjectModel } from '@nestjs/mongoose';
import { Collection } from 'schemas/collection.schema';
import configuration from ' config/configuration';
import { FlashCard, FlashCardDocument } from 'schemas/flashCard.schema';
import { LoggerKey } from 'libs/logger/logger/domain/logger';
import { Model } from 'mongoose';
import { User } from 'schemas/user.schema';
import * as dayjs from 'dayjs';
import * as _ from 'lodash';
import { ObjectId } from 'mongodb';
import { Cron, CronExpression } from '@nestjs/schedule';
@Injectable()
export class UserCollectionService implements OnModuleInit {
    constructor(
        private util: UtilService,
        private jwtService: JwtService,
        private userAuthService: UserAuthService,
        @InjectModel(Collection.name, configuration().database.mongodb_bin.name)
        private bin_collectionModel: Model<Collection>,
        @InjectModel(FlashCard.name, configuration().database.mongodb_main.name)
        private flashCardModel: Model<FlashCard>,
        @Inject(LoggerKey) private logger: Logger,
        @InjectModel(User.name, configuration().database.mongodb_main.name) private userModel: Model<User>,
        @InjectModel(Collection.name, configuration().database.mongodb_main.name)
        private collectionModel: Model<Collection>,
    ) {}

    /**
     * find all of the flashcards that need to review to day
     */
    async findReviewFlashcards(collectionId: string): Promise<string[]> {
        /**
         * check if the collection exist
         */
        const collection = await this.collectionModel.findById(collectionId).populate({
            path: 'cards',
            model: FlashCard.name,
        });

        /**
         * find all the flashcards that have nextReviewDate before the current date
         */

        const flashcards = collection.cards as FlashCardDocument[];

        const today = dayjs();

        // the card that has nextReviewDate before the current date
        const todayReviewFlashCards = _.filter(flashcards, function (o) {
            return !today.isBefore(dayjs(o.SRS.nextReviewDate));
        });

        return todayReviewFlashCards.map((card) => card._id.toString());
    }

    /**
     * Update card to review session
     */

    async pushToCardToReviewSession(collectionId: string, cardIds: string[]) {
        const collection = await this.collectionModel.findById(collectionId);
        let cardIdsVerified = [];
        if (!collection?.reviewSession) {
            collection.reviewSession = { cards: [] };
        }
        const reviewSessionCards = collection.reviewSession.cards.map((item) => item.toString());
        // verify that the card exists in the collection's flashcards
        _.forEach(cardIds, function (o) {
            if (
                _.includes(
                    collection.cards.map((item) => item.toString()),
                    o,
                )
            ) {
                cardIdsVerified.push(o);
            }
        });

        _.pullAll(reviewSessionCards, cardIdsVerified);
        // remove the existing review card and push it to the review session
        _.forEach(cardIdsVerified, function (o) {
            reviewSessionCards.push(o);
        });

        collection.reviewSession.cards = reviewSessionCards;

        await collection.save();
    }

    async updateReviewSession() {}

    // @Cron(CronExpression.EVERY_12_HOURS)
    // async updateReviewSession() {
    // }

    onModuleInit() {
        // this.updateReviewSession();
    }
}

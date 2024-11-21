import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { Collection } from 'schemas/collection.schema';
import {
    CollectionGQLObject,
    CollectionQueryGQLObject,
    CollectionQueryOptionDto,
    CreateCollectionDto,
    UpdateCollectionDto,
} from 'dto/collection.dto';
import {
    BadRequestException,
    ForbiddenException,
    Inject,
    InternalServerErrorException,
    Logger,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard, AuthGuardGraphqlServer } from 'src/auth/guard/auth.guard';
import { InjectModel } from '@nestjs/mongoose';
import configuration from ' config/configuration';
import { Model } from 'mongoose';
import { jwtPayloadDto } from 'dto/jwt.dto';
import { LoggerKey } from 'libs/logger/logger/domain/logger';
import {
    FlashCard,
    FlashCardDocument,
    FlashCardGQLObject,
    FlashCardQueryGQLObject,
    NeedToReviewFlashCardGQLObject,
} from 'schemas/flashCard.schema';
import { User } from 'schemas/user.schema';
import { ObjectId } from 'mongodb';
import { FlashCardQueryOptionDto } from 'dto/flashcard.dto';
import * as _ from 'lodash';
import { ForbiddenError } from 'apollo-server-express';
import { ListResponseDto } from 'dto/ListResponse.dto';
import * as dayjs from 'dayjs';
import { UserCollectionService } from './user.collection.service';

@Resolver(() => CollectionGQLObject)
@UseGuards(AuthGuardGraphqlServer)
export class UserCollectionResolver {
    constructor(
        @InjectModel(FlashCard.name, configuration().database.mongodb_main.name)
        private flashCardModel: Model<FlashCard>,
        @Inject(LoggerKey) private logger: Logger,
        @InjectModel(User.name, configuration().database.mongodb_main.name) private userModel: Model<User>,
        @InjectModel(Collection.name, configuration().database.mongodb_main.name)
        private collectionModel: Model<Collection>,
        private useCollectionService: UserCollectionService,
    ) {}

    /**
     *
     * @param context
     * @param limit
     * @param skip
     * @param order
     * @param sortBy
     * @returns list of collection
     */
    @Query(() => CollectionQueryGQLObject)
    async getUserCollections(
        @Context() context: Partial<{ req: { user: jwtPayloadDto } }>, // Use context to access the request
        @Args('limit', { type: () => Int, defaultValue: 30 }) limit: number,
        @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number,
        @Args('order', { type: () => String, defaultValue: 'desc' }) order: 'asc' | 'desc',
        @Args('sortBy', { type: () => String, defaultValue: 'createdAt' })
        sortBy: CollectionQueryOptionDto['sortBy'],
    ) {
        const { sub } = context.req.user;
        let sort = {};

        sort[sortBy] = order;

        return new ListResponseDto({
            total: await this.collectionModel.find({ owner: new ObjectId(sub) }).countDocuments(),
            skip: skip,
            limit: limit,
            data: await this.collectionModel
                .find({ owner: new ObjectId(sub) })
                .sort(sort)
                .limit(limit)
                .skip(skip)
                .lean()
                .exec(),
        });
    }

    /**
     *
     * @param context
     * @param id
     */
    @Query(() => CollectionGQLObject)
    async getCollectionById(
        @Context() context: Partial<{ req: { user: jwtPayloadDto } }>, // Use context to access the request
        @Args('id', { type: () => String }) id: string,
    ) {
        const collection = await this.collectionModel
            .findOne({ _id: new ObjectId(id), owner: new ObjectId(context.req.user.sub) })
            .exec();

        return collection;
    }

    @Query(() => FlashCardQueryGQLObject)
    async getCollectionFlashCards(
        @Context() context: Partial<{ req: { user: jwtPayloadDto } }>, // Use context to access the request
        @Args('limit', { type: () => Int, defaultValue: 30 }) limit: number,
        @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number,
        @Args('order', { type: () => String, defaultValue: 'desc' }) order: 'asc' | 'desc',
        @Args('sortBy', { type: () => String, nullable: true })
        sortBy: FlashCardQueryOptionDto['sortBy'],
        @Args('filter', { type: () => String, nullable: true }) filter: string | null,
        @Args('collection_id', { type: () => String }) collection_id: string,
    ) {
        const { sub } = context.req.user;
        let sort = {};
        sortBy ? (sort[sortBy] = order) : (sort = null);

        const collection = await this.collectionModel.findById(collection_id).populate({
            path: 'cards',
            model: FlashCard.name,
            options: {
                limit: limit,
                skip: skip,
                sort: sort,
            },
        });

        if (!collection) {
            throw new BadRequestException('Collection not found');
        }

        if (collection.owner.toString() !== sub) {
            throw new ForbiddenException('You cannot access this collection');
        }
        const total = (await this.collectionModel.findById(collection_id)).cards.length;
        return new ListResponseDto({
            total: total,
            skip: skip,
            limit: total > limit ? limit : total,
            data: _.filter(collection.cards, async function (o: FlashCard) {
                // * maybe f

                if (filter === 'review') return !dayjs(o.SRS.nextReviewDate).isAfter(dayjs());
                return true;
            }),
        });
    }

    @Query(() => NeedToReviewFlashCardGQLObject)
    async getNeedToReviewFlashCards(
        @Context() context: Partial<{ req: { user: jwtPayloadDto } }>, // Use context to access the request
        @Args('limit', { type: () => Int, defaultValue: 30 }) limit: number,
        @Args('skip', { type: () => Int, defaultValue: 0 }) skip: number,
        @Args('order', { type: () => String, defaultValue: 'desc' }) order: 'asc' | 'desc',
        @Args('sortBy', { type: () => String, defaultValue: '_id' })
        sortBy: FlashCardQueryOptionDto['sortBy'],
        @Args('collection_id', { type: () => String }) collection_id: string,
    ) {
        try {
            const { sub } = context.req.user;
            let sort = {};
            sort[sortBy] = order;

            // /**
            //  * find all the flashcards that have nextReviewDate before the current date
            //  */

            // const flashcards = collection.cards as FlashCardDocument[];

            // const today = dayjs();

            // // the card that has nextReviewDate before the current date
            // const todayReviewFlashCards = _.filter(flashcards, function (o) {
            //     return !today.isBefore(dayjs(o.SRS.nextReviewDate));
            // });

            // // add the flashcards to the review session if the review session does not exist
            // todayReviewFlashCards.forEach((item) => {
            //     if (!collection?.reviewSession) {
            //         // initialize review session
            //         collection.reviewSession = { cards: [] };
            //     }

            //     // check if the card exist in review session
            //     if (!_.includes(collection.reviewSession.cards, item._id.toString())) {
            //         collection.reviewSession.cards.push(item._id.toString());
            //     }
            // });

            // await collection.save();

            // await this.useCollectionService.updateCardToReviewSession(
            //     collection_id,
            //     await this.useCollectionService.findReviewFlashcards(collection_id),
            // );

            /**
             * check if the collection exist
             */
            const collection = await this.collectionModel.findById(collection_id);

            /**
             * find all of the flashcards that need to be reviewed today
             */
            const needToReviewCards = await this.useCollectionService.findReviewFlashcards(collection_id);

            // remove the flashcards that have already existed in reivewSession
            _.pullAll(needToReviewCards, collection.reviewSession.cards);

            // update the cards to review session
            await this.useCollectionService.pushToCardToReviewSession(collection_id, needToReviewCards);
            const updatedColletion = await this.collectionModel.findById(collection_id);

            return new NeedToReviewFlashCardGQLObject({
                total: collection.reviewSession.cards.length,
                skip,
                limit,
                data: await Promise.all(
                    updatedColletion.reviewSession.cards.map(async (item): Promise<FlashCardGQLObject> => {
                        const card = await this.flashCardModel.findById(item).lean().exec();
                        return {
                            _id: card._id.toString(),
                            front: card.front,
                            back: card.back,
                            SRS: card.SRS,
                            inCollection: card.inCollection.toString(),
                        };
                    }),
                ),
            });
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException();
        }
    }
}

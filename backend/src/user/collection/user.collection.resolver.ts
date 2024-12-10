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
    HttpException,
    Inject,
    InternalServerErrorException,
    Logger,
    NotFoundException,
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
import { CollectionService } from 'src/collection/collection.service';

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
        private collectionService: CollectionService,
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
        await this.collectionService.removeUnexistedFlashCards(id);

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
        await this.collectionService.removeUnexistedFlashCards(collection_id);
        await this.collectionService.removeDuplicateCardInCollection(collection_id);

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

            /**
             * check if the collection exist
             */
            const collection = await this.collectionModel.findById(collection_id);

            // IMPORTANT : check if the user have access to this
            if (!collection) {
                throw new NotFoundException('Not found collection');
            }

            if (collection.owner.toString() !== sub) {
                throw new ForbiddenException('You are not allowed to access this collection');
            }

            // * initialize the review session if not exist
            if (!collection?.reviewSession?.cards) {
                collection.reviewSession = {
                    cards: [],
                };
                await collection.save();
            }

            await this.collectionService.removeDuplicatesInReviewSession(collection_id);

            // * remove cards don't need to be reviewed today
            await this.collectionService.removeNotYetExpiredCardInReviewSession(collection_id);

            /**
             * find all of the flashcards that need to be reviewed today
             */
            const needToReviewCards = await this.useCollectionService.findReviewFlashcards(collection_id);

            // remove the flashcards that have already existed in reivewSession
            _.pullAll(needToReviewCards, collection.reviewSession.cards);

            // update the cards to review session
            await this.useCollectionService.pushToCardToReviewSession(collection_id, needToReviewCards);

            // remove unexpected cards
            await this.collectionService.removeUnexistedCardsInReviewSession(collection_id);

            // query the collection
            const updatedColletion = await this.collectionModel.findById(collection_id);

            return new NeedToReviewFlashCardGQLObject({
                total: collection.reviewSession.cards.length,
                skip,
                limit,
                data: await Promise.all(
                    updatedColletion.reviewSession.cards.map(async (item): Promise<FlashCardGQLObject> => {
                        const card = await this.flashCardModel.findById(item);
                        if (!card) {
                            throw new BadRequestException('Card not found');
                        }
                        // * check if the card's inCollection field is empty
                        if (!card.inCollection) {
                            card.inCollection = collection._id;
                            await card.save();
                        }
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
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException();
        }
    }
}

import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { Collection, CollectionGQLObject, CollectionQueryGQLObject } from 'schemas/collection.schema';
import { CollectionQueryOptionDto, CreateCollectionDto, UpdateCollectionDto } from 'dto/collection.dto';
import { BadRequestException, ForbiddenException, Inject, Logger, UseGuards } from '@nestjs/common';
import { AuthGuard, AuthGuardGraphqlServer } from 'src/guard/auth.guard';
import { InjectModel } from '@nestjs/mongoose';
import configuration from ' config/configuration';
import { Model } from 'mongoose';
import { jwtPayloadDto } from 'dto/jwt.dto';
import { LoggerKey } from 'libs/logger/logger/domain/logger';
import { FlashCard, FlashCardGQLObject, FlashCardQueryGQLObject } from 'schemas/flashCard.schema';
import { User } from 'schemas/user.schema';
import { ObjectId } from 'mongodb';
import { FlashCardQueryOptionDto } from 'dto/flashcard.dto';
import * as _ from 'lodash';
import { ForbiddenError } from 'apollo-server-express';
import { ListResponseDto } from 'dto/ListResponse.dto';
import * as dayjs from 'dayjs';

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
        @Args('sortBy', { type: () => String, defaultValue: '_id' })
        sortBy: FlashCardQueryOptionDto['sortBy'],
        @Args('filter', { type: () => String }) filter: string | null,
        @Args('collection_id', { type: () => String }) collection_id: string,
    ) {
        const { sub } = context.req.user;
        let sort = {};
        sort[sortBy] = order;

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
            data: _.filter(collection.cards, function (o: FlashCard) {
                if (filter === 'review') return !dayjs(o.SRS.nextReviewDate).isAfter(dayjs());
                return true;
            }),
        });
    }

    // @Mutation(() => Collection)
    // async createCollection(@Args('createCollectionDto') createCollectionDto: CreateCollectionDto) {
    //     return this.collectionModel.create(createCollectionDto);
    // }

    // @Mutation(() => Collection)
    // async updateCollection(
    //     @Args('id', { type: () => String }) id: string,
    //     @Args('updateCollectionDto') updateCollectionDto: UpdateCollectionDto,
    // ) {
    //     return this.collectionModel.update(id, updateCollectionDto);
    // }

    // @Mutation(() => String)
    // async deleteCollection(@Args('id', { type: () => String }) id: string) {
    //     return this.collectionModel.remove(id);
    // }
}

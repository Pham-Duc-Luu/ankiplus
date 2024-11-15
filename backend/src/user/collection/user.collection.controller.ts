import {
    Body,
    Controller,
    Get,
    UseGuards,
    Request,
    BadRequestException,
    InternalServerErrorException,
    Post,
    Query,
    Param,
    Put,
    Patch,
    HttpException,
    Inject,
    UsePipes,
    ValidationPipe,
    Delete,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
    CollectionDetailQueryDto,
    CollectionQueryOptionDto,
    CreateCollectionDto,
    UpdateCollectionDto,
} from 'dto/collection.dto';
import { CreateFlashCardDto, FlashCardQueryOptionDto } from 'dto/flashcard.dto';
import { ListResponseDto } from 'dto/ListResponse.dto';
import Logger, { LoggerKey } from 'libs/logger/logger/domain/logger';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { Collection, CollectionDocument } from 'schemas/collection.schema';
import { FlashCard, FlashCardDocument } from 'schemas/flashCard.schema';
import { User } from 'schemas/user.schema';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { UtilService } from 'src/util/util.service';
import { pickFields } from 'utils/utils';

import { query } from 'express';
import { UserAuthService } from '../user.service';
import { ParamValidate } from 'src/auth/guard/param.validate.guard';
import configuration from ' config/configuration';
import { jwtPayloadDto } from 'dto/jwt.dto';

var _ = require('lodash');

@ApiTags('users/collections')
@UseGuards(AuthGuard)
@UseGuards(ParamValidate)
@UsePipes(new ValidationPipe({ transform: true }))
@Controller('users/collections')
export class UserCollectionController {
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
     * Retrieves all collections owned by the user, including public ones.
     * If a collection ID is provided in the parameters, it returns a specific collection.
     *
     * @param req - The request object containing the user's JWT payload.
     * @param limit - The maximum number of collections to return (default: 30).
     * @param skip - The number of collections to skip (default: 0).
     * @param order - The order of collections (default: 'asc').
     * @param param - The parameters object containing the collection ID.
     *
     * @returns A Promise that resolves to a ListResponseDto containing the collections.
     *
     * @throws BadRequestException - If there are issues with the user's account.
     * @throws InternalServerErrorException - If an error occurs during the retrieval process.
     */
    @ApiOperation({ summary: 'Get all collections from a user' })
    @Get('')
    async getUserCollection(
        @Request() req: { user: jwtPayloadDto },
        @Query()
        {
            limit = 30,
            skip = 0,
            order = 'asc',
            select = ['_id', 'name', 'description', 'owner', 'isPublic', 'language', 'updatedAt', 'cards', 'createdAt'],
            sortBy = 'createdAt',
        }: CollectionQueryOptionDto,
    ): Promise<
        ListResponseDto<
            Pick<CollectionDocument, '_id' | 'name' | 'description' | 'owner' | 'isPublic' | 'language'> & {
                cards: ListResponseDto<Pick<FlashCardDocument, '_id' | 'front'>> | [];
            }
        >
    > {
        const { sub } = req.user;

        const FLASHCARD_LIMIT = 10;
        const FLASHCARD_SKIP = 0;

        let sort = {};

        sort[sortBy] = order;

        try {
            const user = await this.userModel
                .findById(sub)
                .select('_id')
                .populate({
                    path: 'FlashCard',
                    model: FlashCard.name,
                    options: {
                        limit: limit,

                        skip: skip,

                        sort: sort,
                        // populate: {
                        //     path: 'cards',
                        //     model: FlashCard.name,
                        //     options: {
                        //         limit: FLASHCARD_LIMIT,
                        //         skip: FLASHCARD_SKIP,
                        //         // sort: { createdAt: order === 'asc' ? 1 : -1 },
                        //         select: 'id front',
                        //     },
                        // },
                        match: { isPublic: true },
                    },
                });

            if (!user) {
                throw new BadRequestException('There are some things wrong with your account');
            }

            return new ListResponseDto({
                data: await Promise.all(
                    user.collections.map(async (collection: CollectionDocument) => {
                        const pickCollections = pickFields(collection, select);

                        return {
                            ...pickCollections,
                            cards: select.includes('cards')
                                ? new ListResponseDto({
                                      data: await Promise.all(
                                          pickCollections.cards
                                              .slice(FLASHCARD_SKIP, FLASHCARD_LIMIT)
                                              .map(async (item: FlashCardDocument) => {
                                                  return pickFields(await this.flashCardModel.findById(item._id), [
                                                      '_id',
                                                      'front',
                                                      'back',
                                                  ]);
                                              }),
                                      ),
                                      skip: FLASHCARD_SKIP,
                                      limit: FLASHCARD_LIMIT,
                                      total: await this.userAuthService.getCardslength(collection._id.toString()),
                                  })
                                : [],
                        };
                    }),
                ),
                total: await this.userAuthService.getCollectionsLength(user._id.toString()),
                skip: skip,
                limit: Number(limit),
            });
            // return await this.collectionModel
            //     .find({ owner: new ObjectId(sub) })
            //     .populate({ path: 'cards', select: 'id front', model: FlashCard.name })
            //     .populate('owner', 'id email name')
            //     .sort({ name: query.order === 'asc' ? 1 : -1, createdAt: -1 })
            //     .limit(query.limit || 30)
            //     .skip(query.skip || 0)
            //     .exec();
        } catch (error) {
            this.logger.error(error.message, error.stack);
            throw new InternalServerErrorException();
        }
    }

    @ApiOperation({ summary: 'Get colletion information' })
    @Get('/:id')
    async getUserCollectionDetail(
        @Request() req: { user: jwtPayloadDto },
        @Query()
        {
            limit = 30,
            skip = 0,
            order = 'asc',
            sortBy = '_id',
            select = ['_id', 'name', 'description', 'owner', 'isPublic', 'language', 'updatedAt', 'cards', 'createdAt'],
        }: CollectionQueryOptionDto,
        @Param() param: { id?: string },
    ): Promise<CollectionDetailQueryDto<Pick<FlashCardDocument, '_id'>>> {
        if (!param?.id) {
            throw new BadRequestException('Collection ID must be provided');
        }

        const { sub } = req.user;

        let sort = {};

        sort[sortBy] = order;

        // check if the collection is exist
        const collections = await this.collectionModel.find({ _id: param.id }).populate({
            path: 'cards',
            model: FlashCard.name,
            options: {
                limit: limit,

                skip: skip,

                sort: sort,
                // populate: {
                //     path: 'cards',
                //     model: FlashCard.name,
                //     options: {
                //         limit: FLASHCARD_LIMIT,
                //         skip: FLASHCARD_SKIP,
                //         // sort: { createdAt: order === 'asc' ? 1 : -1 },
                //         select: 'id front',
                //     },
                // },
            },
        });
        if (!collections) {
            throw new NotFoundException('Collection not found');
        }

        const collection = collections[0] as CollectionDocument;

        // check if user has permission to query the collection
        if (collection.owner.toString() !== sub) {
            throw new ForbiddenException('You are not authorized to access this collection');
        }

        return new CollectionDetailQueryDto({
            ...pickFields(collection, select),
            cards: new ListResponseDto({
                data: await Promise.all(
                    collection.cards.map(async (card, index) => {
                        return pickFields(await this.flashCardModel.findOne({ _id: card }), ['_id', 'front', 'back']);
                    }),
                ),
                skip,
                limit,
                total: await this.userAuthService.getCardslength(collection._id.toString()),
            }),
        });
    }

    /**
     * * Update a collectionn information
     * ! must provide a unique id
     */
    @ApiOperation({ summary: "Update collection's information" })
    @Patch('/:id?')
    async updateCollection(
        @Request() req: { user: jwtPayloadDto },
        @Body() body: UpdateCollectionDto,
        @Param() param: { id: string },
    ) {
        if (!param?.id) {
            throw new BadRequestException('Collection ID must be provided');
        }
        try {
            const collection = await this.collectionModel.findOne({
                $and: [{ owner: new ObjectId(req.user.sub) }, { _id: new ObjectId(param.id) }],
            });
            if (!collection) {
                return new BadRequestException('Collection not found');
            }
            if (body.name) {
                collection.name = body.name;
            }
            if (body.description) {
                collection.description;
            }
            if (body.thumbnail) {
                collection.thumbnail = body.thumbnail;
            }
            if (body.icon) {
                collection.icon = body.icon;
            }
            if (body.isPublic) {
                collection.isPublic = body.isPublic;
            }
            await collection.save();
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException();
        }

        return 'Collection updated successfully';
    }

    @ApiOperation({ summary: 'create a new collection' })
    @Post('')
    async createCollections(@Request() req: { user: jwtPayloadDto }, @Body() body: CreateCollectionDto) {
        const { name, flashCards, description, isPublic, thumnail, language, icon } = body;
        const { sub } = req.user;

        const user = await this.userModel.findById(sub);
        if (!user) {
            throw new BadRequestException('There are some things wrong with your account');
        }

        if (!name) {
            throw new BadRequestException('You must provide a name');
        }

        if (await this.collectionModel.findOne({ name })) {
            throw new BadRequestException('Collection name already exists');
        }

        try {
            const collection = await this.collectionModel.create({
                name,
                description,
                thumnail,
                isPublic,
                language,
                owner: user._id,
            });
            if (flashCards?.length > 0) {
                const createFlashCard = await this.flashCardModel.create(flashCards);
                collection.cards.push(...createFlashCard.map((card) => card._id.toString()));
                collection.reviewSession.cards.push(...createFlashCard.map((card) => card._id.toString()));
            }
            user.collections.push(collection._id);
            await user.save();
        } catch (error) {
            this.logger.error(error.message, error.stack);
            throw new InternalServerErrorException();
        }

        return 'collection is created successfully';
    }

    @ApiOperation({ summary: 'add a flash card to collection' })
    @Put(':id/flashcards')
    async addFlashCards(
        @Request() req: { user: jwtPayloadDto },
        @Body() body: CreateFlashCardDto[],
        @Param() param: { id: string },
    ) {
        if (!param?.id) {
            throw new BadRequestException('Collection not found');
        }

        if (!Array.isArray(body)) {
            throw new BadRequestException('Please provide flashcards');
        }
        try {
            const newFlashCards = await this.flashCardModel.create([...body]);
            const updataCollection = await this.collectionModel.findById(param.id);
            updataCollection.cards.push(...newFlashCards);
            await updataCollection.save();
        } catch (error) {
            this.logger.error(error.message, error.stack);
            throw new InternalServerErrorException();
        }

        return 'Add flash cards successfully';
    }

    @ApiOperation({ summary: 'get list of flashcards that  need to be reviewed' })
    @Get(':id/flashcards/review')
    async getReviewList(@Request() req: { user: jwtPayloadDto }, @Param() param: { id: string }) {
        try {
            const user = await this.userModel.findById(req.user.sub);

            if (!user.collections.find((c) => c === param.id)) {
                throw new BadRequestException('Cannot find collection');
            }

            const collection = await this.collectionModel
                .findById(param.id)
                .populate({ path: 'cards', model: FlashCard.name })
                .exec();

            const reviewCard = collection.cards.filter((cards) => {
                return typeof cards !== 'string';
            });

            return reviewCard.filter((card) => new Date(card.SRS.nextReviewDate).getTime() <= new Date().getTime());
        } catch (error) {
            this.logger.error(error);
            if (error instanceof HttpException) {
                throw error;
            }

            throw new InternalServerErrorException();
        }
        return;
    }

    @ApiOperation({ summary: 'delete colletion' })
    @Delete(':id')
    async deleteCollection(@Request() req: { user: jwtPayloadDto }, @Param() param: { id: string }) {
        try {
            const collection = await this.collectionModel.findOne({
                _id: new ObjectId(param.id),
                owner: new ObjectId(req.user.sub),
            });
            console.log(collection);

            if (!collection) {
                return new BadRequestException('Collection not found');
            }
            const user = await this.userModel.findById(req.user.sub);

            _.remove(user.collections, function (o) {
                return o.toString() === param.id;
            });

            // await this.collectionModel.deleteOne({ _id: new ObjectId(param.id) });
            await collection.deleteOne();

            return 'Deleted';
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException();
        }
    }
}

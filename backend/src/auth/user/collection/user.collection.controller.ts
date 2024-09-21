import {
    Body,
    Controller,
    Get,
    UseGuards,
    Request,
    BadRequestException,
    Logger,
    InternalServerErrorException,
    Post,
    Query,
    Param,
    Put,
    Patch,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateCollectionDto } from 'dto/create-collection.dto';
import { CreateFlashCardDto } from 'dto/create-flashcard.dto';
import { jwtPayloadDto } from 'dto/jwt-payload.dto';
import { QueryOptionDto } from 'dto/query-option.dto';
import { UpdateCollectionDto } from 'dto/update-collection.dto';
import { Model } from 'mongoose';
import { Collection } from 'schemas/collection.schema';
import { FlashCard } from 'schemas/flashCard.schema';
import { User } from 'schemas/user.schema';
import { UtilService } from 'src/app.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { WinstonLoggerService } from 'src/logger/logger.service';

@ApiTags('users/collections')
@UseGuards(AuthGuard)
@Controller('users/collections')
export class UserCollectionController {
    constructor(
        private util: UtilService,
        private jwtService: JwtService,
        @InjectModel(FlashCard.name) private flashCardModel: Model<FlashCard>,
        private readonly logger: WinstonLoggerService,

        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Collection.name) private collectionModel: Model<Collection>,
    ) {}

    /**
     * * this is api to get all collections that are owned by the user
     * * also this can get a specific collection by get a id
     */
    @ApiOperation({ summary: 'Get all collections from a user' })
    @Get('/:id?')
    async getUserCollection(
        @Request() req: { user: jwtPayloadDto },
        @Query() query: QueryOptionDto,
        @Param() param: { id?: string },
    ) {
        const { sub } = req.user;

        const user = await this.userModel
            .findById(sub)
            .populate({ path: 'collections', model: Collection.name, select: 'id' });

        if (!user) {
            throw new BadRequestException('There are some things wrong with your account');
        }

        try {
            if (param.id) {
                return await this.collectionModel
                    .findOne({ $and: [{ _id: param.id }, { owner: sub }] })
                    .populate({ path: 'newFlashCards', model: FlashCard.name })
                    .populate({ path: 'waitedFlashCards', model: FlashCard.name })
                    .populate({ path: 'previewingFlashCards', model: FlashCard.name })

                    .populate('owner', 'id email name')
                    .sort({ name: query.order === 'asc' ? 1 : -1 })
                    .limit(query.limit || 30)
                    .skip(query.skip || 0)
                    .exec();
            }

            return await this.collectionModel
                .find({ owner: sub })
                .populate({ path: 'newFlashCards', select: 'id front', model: FlashCard.name })
                .populate('owner', 'id email name')
                .sort({ name: query.order === 'asc' ? 1 : -1 })
                .limit(query.limit || 30)
                .skip(query.skip || 0)
                .exec();
        } catch (error) {
            this.logger.error(error.message, error.stack);
            throw new InternalServerErrorException();
        }
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
                $and: [{ owner: req.user.sub }, { _id: param.id }],
            });

            if (body.name) {
                collection.name = body.name;
            }
            if (body.isPublic) {
                collection.isPublic = body.isPublic;
            }
            await collection.save();
        } catch (error) {
            Logger.error(error);
            throw new InternalServerErrorException();
        }

        return 'Collection updated successfully';
    }

    @ApiOperation({ summary: 'create a new collection' })
    @Post('')
    async createCollections(@Request() req: { user: jwtPayloadDto }, @Body() body: CreateCollectionDto) {
        const { name, flashCards } = body;
        const { sub } = req.user;

        const user = await this.userModel.findById(sub);
        if (!user) {
            throw new BadRequestException('There are some things wrong with your account');
        }

        if (!name) {
            throw new BadRequestException('You must provide a name');
        }

        if (!flashCards || !Array.isArray(flashCards) || flashCards.length <= 0) {
            throw new BadRequestException('You must provide a flash card');
        }

        if (await this.collectionModel.findOne({ name })) {
            throw new BadRequestException('Collection name already exists');
        }

        try {
            const createFlashCard = await this.flashCardModel.create(flashCards);
            const collection = await this.collectionModel.create({
                name,
                owner: sub,
                newFlashCards: createFlashCard.map((item) => item.id),
            });

            const updateUserCollection = await this.userModel
                .findByIdAndUpdate(
                    sub,
                    {
                        $push: { collections: collection.id },
                    },
                    { new: true },
                )
                .exec();
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
            updataCollection.newFlashCards.push(...newFlashCards);
            await updataCollection.save();
        } catch (error) {
            this.logger.error(error.message, error.stack);
            throw new InternalServerErrorException();
        }

        return 'Add flash cards successfully';
    }
}

import configuration from ' config/configuration';
import {
    Controller,
    Get,
    UseGuards,
    Request,
    Param,
    BadRequestException,
    InternalServerErrorException,
    HttpException,
    Inject,
    Delete,
    Patch,
    Body,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { trace } from 'console';
import { jwtPayloadDto } from 'dto/jwt.dto';
import mongoose, { Model } from 'mongoose';
import { Collection } from 'schemas/collection.schema';
import { FlashCard } from 'schemas/flashCard.schema';
import { User } from 'schemas/user.schema';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { UtilService } from 'src/util/util.service';
import Logger, { LoggerKey } from '../../../libs/logger/logger/domain/logger';
import { ObjectId } from 'mongodb';
import { EditFlashCardDto } from '../../../dto/flashcard.dto';
import * as _ from 'lodash';
import { SRSService } from './Srs.flashCard.service';
import { IsOptional } from 'class-validator';
import { UserCollectionService } from '../collection/user.collection.service';

@Controller('users')
@UseGuards(AuthGuard)
@ApiTags('users/flashcards')
export class UserFlashCardController {
    constructor(
        private util: UtilService,
        private jwtService: JwtService,
        @InjectModel(FlashCard.name, configuration().database.mongodb_main.name)
        private flashCardModel: Model<FlashCard>,
        // private logger: WinstonLoggerService,
        @Inject(LoggerKey) private logger: Logger,
        private SrsService: SRSService,
        @InjectModel(User.name, configuration().database.mongodb_main.name) private userModel: Model<User>,
        @InjectModel(Collection.name, configuration().database.mongodb_main.name)
        private collectionModel: Model<Collection>,
        private userCollectionService: UserCollectionService,
    ) {}

    /**
     * ! This is very important api method
     * TODO: 1. check if the flash card is ever been study or not
     */
    @ApiOperation({ summary: 'Study a flash card' })
    @Get('/collections/:collectionId/flashcards/:flashCardId/review/:quality')
    async studyFlashCard(
        @Request() req: { user: jwtPayloadDto },
        @Param()
        param: {
            collectionId: string;
            flashCardId: string;
            quality: string;
        },
    ) {
        if (!param.collectionId || !param.flashCardId) {
            throw new BadRequestException('Need collectionId or flashCardId');
        }

        const quality = Number(param.quality);

        if (quality < 0 || quality > 5) {
            throw new BadRequestException();
        }

        try {
            const stuydingFlashCard = await this.flashCardModel.findById(param.flashCardId);

            const card = await this.SrsService.updateSRS(quality, param.flashCardId);

            // await this.userCollectionService.pushToCardToReviewSession(param.collectionId, [card._id.toString()]);

            return card.SRS;
        } catch (error) {
            // this.logger.error(error);
            if (error instanceof HttpException) {
                return error;
            }

            if ((error.kind = 'ObjectId')) {
                throw new BadRequestException("Collection's id or flashcard's id may be wrong");
            }
            return new InternalServerErrorException('Failed ');
        }
    }

    @ApiOperation({ summary: 'delete flashcard' })
    @Delete('/collections/:collectionId/flashcards/:flashCardId')
    async deleteFlashCard(
        @Request() req: { user: jwtPayloadDto },
        @Param()
        param: {
            collectionId: string;
            flashCardId: string;
        },
    ) {
        try {
            const collection = await this.collectionModel.findOne({
                _id: new ObjectId(param.collectionId),
                owner: new ObjectId(req.user.sub),
            });

            if (!collection) {
                return new BadRequestException('Collection not found');
            }

            const flashCard = await this.flashCardModel.findOne({
                _id: new ObjectId(param.flashCardId),
                inCollection: collection._id,
            });

            if (!flashCard) return new BadRequestException('FlashCard not found');

            _.remove(collection.cards, function (o) {
                return o.toString() === flashCard._id.toString();
            });

            await flashCard.deleteOne();
            await collection.save();
            return 'deleted';
        } catch (e) {
            this.logger.error(e);
            throw new InternalServerErrorException();
        }
    }

    @ApiOperation({ summary: 'edit flashcard' })
    @Patch('/collections/:collectionId/flashcards/:flashCardId')
    async updateFlashCard(
        @Request() req: { user: jwtPayloadDto },
        @Param()
        param: {
            flashCardId: string;
            collectionId: string;
        },
        @Body() body: EditFlashCardDto,
    ) {
        try {
            const collection = await this.collectionModel.findOne({
                _id: new ObjectId(param.collectionId),
                owner: new ObjectId(req.user.sub),
            });

            if (!collection) {
                return new BadRequestException('Collection not found');
            }

            const flashCard = await this.flashCardModel.findOne({
                _id: new ObjectId(param.flashCardId),
                inCollection: new ObjectId(param.collectionId),
            });

            if (!flashCard) return new BadRequestException('flashCard not found');

            if (body.front) flashCard.front = body.front;
            if (body.back) flashCard.back = body.back;

            await flashCard.save();

            return 'FlashCard updated';
        } catch (e) {
            this.logger.error(e);

            throw new InternalServerErrorException();
        }
    }
}

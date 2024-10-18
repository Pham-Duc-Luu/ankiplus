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
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { trace } from 'console';
import { jwtPayloadDto } from 'dto/jwt.dto';
import { Model } from 'mongoose';
import { Collection } from 'schemas/collection.schema';
import { FlashCard } from 'schemas/flashCard.schema';
import { User } from 'schemas/user.schema';
import { AuthGuard } from 'src/guard/auth.guard';
import { UtilService } from 'src/util/util.service';

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
        @InjectModel(User.name, configuration().database.mongodb_main.name) private userModel: Model<User>,
        @InjectModel(Collection.name, configuration().database.mongodb_main.name)
        private collectionModel: Model<Collection>,
    ) {}

    /**
     * ! This is very important api method
     * TODO: 1. check if the flash card is ever been study or not
     */
    @ApiOperation({ summary: 'Study a flash card' })
    @Get('/collections/:collectionId/flashcards/:flashCardId/review')
    async studyFlashCard(
        @Request() req: { user: jwtPayloadDto },
        @Param()
        param: {
            collectionId: string;
            flashCardId: string;
        },
    ) {
        if (!param.collectionId || !param.flashCardId) {
            throw new BadRequestException('Need collectionId or flashCardId');
        }
        try {
            const existCollection = await this.collectionModel.find({ _id: param.collectionId });

            const stuydingFlashCard = await this.flashCardModel.findById(param.flashCardId);
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
}

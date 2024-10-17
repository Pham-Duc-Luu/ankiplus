import configuration from ' config/configuration';
import { Body, Controller, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { jwtPayloadDto } from 'dto/jwt-payload.dto';
import { Model } from 'mongoose';
import { Collection } from 'schemas/collection.schema';
import { FlashCard } from 'schemas/flashCard.schema';
import { User } from 'schemas/user.schema';
import { AuthGuard } from 'src/guard/auth.guard';

@Controller('collections/study')
export class StudyCollectionController {
    constructor(
        @InjectModel(User.name, configuration().database.mongodb_main.name) private userModel: Model<User>,
        @InjectModel(Collection.name, configuration().database.mongodb_main.name)
        private collectionModel: Model<Collection>,
        @InjectModel(FlashCard.name, configuration().database.mongodb_main.name)
        private flashCardModel: Model<FlashCard>,
    ) {}

    @UseGuards(AuthGuard)
    @Put('')
    async studyNewFlashCard(@Request() req: { user: jwtPayloadDto }, @Query('id') id: string) {
        const { sub } = req.user;

        try {
            // console.log(await this.flashCardModel.findById(id).exec());
        } catch (error) {}

        return 'You have study a new flash card';
    }
}

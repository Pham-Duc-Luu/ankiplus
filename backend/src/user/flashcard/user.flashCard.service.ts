import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import LoggerService from 'libs/logger/logger/domain/loggerService';
import { Model } from 'mongoose';
import { Collection } from 'schemas/collection.schema';
import { FlashCard } from 'schemas/flashCard.schema';

@Injectable()
export class UserFlashCardService {
    constructor(
        @InjectModel(Collection.name) private collectionModel: Model<Collection>,
        @InjectModel(FlashCard.name) private flashCardModel: Model<FlashCard>,
        // private logger: LoggerService,
    ) {}

    /**
     * TODO
     * ! very important to verify that the flash card only exists in one of collections' flashcards
     */
    async verifyFlashCardOnlyExists(options: { collectionId: string; flashcardId: string }) {
        try {
            const existCollection = await this.collectionModel.findById(options.collectionId);

            //   const array = existCollection.newFlashCards.find((item) => item === options.flashcardId);
        } catch (error) {
            // this.logger.error(error);
        }
    }
}

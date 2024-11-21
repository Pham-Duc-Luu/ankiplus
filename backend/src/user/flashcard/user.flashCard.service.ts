import configuration from ' config/configuration';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import LoggerService from 'libs/logger/logger/domain/loggerService';
import { Model } from 'mongoose';
import { Collection } from 'schemas/collection.schema';
import { FlashCard } from 'schemas/flashCard.schema';

@Injectable()
export class UserFlashCardService {
    constructor(
        @InjectModel(Collection.name, configuration().database.mongodb_main.name)
        private collectionModel: Model<Collection>,
        @InjectModel(FlashCard.name, configuration().database.mongodb_main.name)
        private flashCardModel: Model<FlashCard>,
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

    /**
     * Updates the `front` and `back` fields of a FlashCard by its ID.
     * @param id - The ID of the FlashCard to update.
     * @param updateData - Object containing the updated `front` and `back` fields.
     * @returns Updated FlashCard document.
     */
    async updateFlashCardById(id: string, updateData: { front: any; back: any }): Promise<FlashCard> {
        const updatedFlashCard = await this.flashCardModel.findByIdAndUpdate(
            id,
            { $set: { front: updateData.front, back: updateData.back } }, // Update fields
            { new: true, runValidators: true }, // Options: return updated document and validate
        );

        if (!updatedFlashCard) {
            throw new NotFoundException(`FlashCard with ID "${id}" not found.`);
        }

        return updatedFlashCard;
    }
}

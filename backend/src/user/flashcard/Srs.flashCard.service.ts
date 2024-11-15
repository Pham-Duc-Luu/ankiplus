import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FlashCard } from 'schemas/flashCard.schema';
import configuration from '../../../ config/configuration';
import * as dayjs from 'dayjs';
import Logger, { LoggerKey } from 'libs/logger/logger/domain/logger';
import { UserCollectionService } from '../collection/user.collection.service';

@Injectable()
export class SRSService {
    private static MIN_EFACTOR = 1.3;

    constructor(
        @InjectModel(FlashCard.name, configuration().database.mongodb_main.name)
        private flashCardModel: Model<FlashCard>,
        @Inject(LoggerKey) private logger: Logger,
        private userCollectionService: UserCollectionService,
    ) {}

    /**
     * Updates the SRS (Spaced Repetition System) data for the given flashcard.
     * Adjusts the interval, ease factor, and next review date based on the quality of the user's response.
     *
     * @param quality Quality of the user's recall (1 to 5)
     * @param cardId The ID of the flashcard being reviewed
     * @returns Updated flashcard with new SRS values
     */
    async updateSRS(quality: number, cardId: string) {
        try {
            quality = Math.round(quality);
            // Ensure the quality is in the range of 1 to 5

            // 5 - Hoàn hảo
            // 4 - Trả lời chính xác nhưng còn phải đắn đo
            // 3 - Trả lời chính xác nhưng gặp nhiều khó khăn
            // 2 - Trả lời không chính xác, đáp án đúng dễ dàng nhớ ra
            // 1 - Trả lời sai, nhớ được đáp án
            // 0 - Hoàn toàn không nhớ

            if (quality < 1 || quality > 5) {
                throw new Error('Quality rating must be between 1 and 5.');
            }

            // Find the flashcard by ID
            const card = await this.flashCardModel.findById(cardId);

            // If flashcard not found, throw error
            if (!card) {
                throw new Error('Flashcard not found');
            }
            console.log({ efactor: card.SRS.efactor, quality });

            // Update the ease factor (SuperMemo SM2 formula)
            card.SRS.efactor = Number(
                (card.SRS.efactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))).toFixed(2),
            );

            console.log({ efactor: card.SRS.efactor, quality });

            // Ensure the ease factor does not fall below the minimum
            if (card.SRS.efactor < SRSService.MIN_EFACTOR) {
                card.SRS.efactor = SRSService.MIN_EFACTOR;
            }

            // Update the interval based on the quality
            if (quality === 1) {
                // If the quality is less than 1, reset the interval to 1 day
                card.SRS.interval = 0;
                card.SRS.nextReviewDate = dayjs().toISOString();
                await this.userCollectionService.pushToCardToReviewSession(card.inCollection.toString(), [
                    card._id.toString(),
                ]);
            } else {
                // If the quality is 3 or above, increase the interval based on the ease factor
                // if (card.SRS.interval === 1) {
                //     card.SRS.interval = 6; // First review after 1 day should be in 6 days
                // } else {

                if (card.SRS.interval === 0) {
                    card.SRS.interval = 1;
                }
                card.SRS.interval = Number((card.SRS.interval * card.SRS.efactor).toFixed(2));
                console.log(card.SRS.interval);

                // }
                const currentDate = dayjs();
                card.SRS.nextReviewDate = currentDate.add(card.SRS.interval, 'day').toISOString();
            }

            // Update the next review date by adding the interval to the current date

            // Save the updated flashcard with the new SRS values
            await card.save();

            return card;
        } catch (error) {
            console.error(`Failed to update SRS for cardId: ${cardId}. Error: ${error.message}`);
            throw error;
        }
    }
}

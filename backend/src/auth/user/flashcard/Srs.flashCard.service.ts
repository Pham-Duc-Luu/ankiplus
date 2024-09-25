import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FlashCard } from 'schemas/flashCard.schema';

@Injectable()
export class SRSService {
    private static MIN_EFACTOR = 1.3;
    constructor(@InjectModel(FlashCard.name) private flashCardModel: Model<FlashCard>) {}

    /**
     * Updates the SRS (Spaced Repetition System) data for the given flashcard.
     * Adjusts the interval, ease factor, and next review date based on the quality of the user's response.
     *
     * @param quality Quality of the user's recall (1 to 5)
     * @param cardId The ID of the flashcard being reviewed
     * @returns Updated flashcard with new SRS values
     */
    async updateSRS(quality: 1 | 2 | 3 | 4 | 5, cardId: string) {
        try {
            // Ensure the quality is in the range of 1 to 5
            if (quality < 1 || quality > 5) {
                throw new Error('Quality rating must be between 1 and 5.');
            }

            // Find the flashcard by ID
            const card = await this.flashCardModel.findById(cardId);

            // If flashcard not found, throw error
            if (!card) {
                throw new Error('Flashcard not found');
            }

            // Update the ease factor (SuperMemo SM2 formula)
            card.SRS.efactor = card.SRS.efactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

            // Ensure the ease factor does not fall below the minimum
            if (card.SRS.efactor < SRSService.MIN_EFACTOR) {
                card.SRS.efactor = SRSService.MIN_EFACTOR;
            }

            // Update the interval based on the quality
            if (quality < 3) {
                // If the quality is less than 3, reset the interval to 1 day
                card.SRS.interval = 1;
            } else {
                // If the quality is 3 or above, increase the interval based on the ease factor
                if (card.SRS.interval === 1) {
                    card.SRS.interval = 6; // First review after 1 day should be in 6 days
                } else {
                    card.SRS.interval = Math.round(card.SRS.interval * card.SRS.efactor);
                }
            }

            // Update the next review date by adding the interval to the current date
            const currentDate = new Date();
            card.SRS.nextReviewDate = new Date(currentDate.setDate(currentDate.getDate() + card.SRS.interval));

            // Save the updated flashcard with the new SRS values
            await card.save();

            // Return the updated card
            return card;
        } catch (error) {
            console.error(`Failed to update SRS for cardId: ${cardId}. Error: ${error.message}`);
            throw error;
        }
    }
}

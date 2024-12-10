import configuration from ' config/configuration';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FlashCard, FlashCardDocument } from 'schemas/flashCard.schema';

@Injectable()
export class FlashCardService {
    constructor(
        @InjectModel(FlashCard.name, configuration().database.mongodb_main.name)
        private flashCardModel: Model<FlashCard>,
    ) {}

    async deleteFlashCardById(id: string): Promise<{ success: boolean; message: string }> {
        const result = await this.flashCardModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`FlashCard with ID ${id} not found.`);
        }
        return { success: true, message: 'FlashCard deleted successfully' };
    }
}

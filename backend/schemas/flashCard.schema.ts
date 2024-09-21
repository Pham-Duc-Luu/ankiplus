import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class FlashCard {
    @Prop({ required: true, type: mongoose.Schema.Types.Mixed })
    front: any;

    @Prop({ required: true, type: mongoose.Schema.Types.Mixed })
    back: any;

    @Prop({ type: Date })
    lastPreview: Date;

    @Prop({ type: Number })
    nextPreviewIn: number;
}

export type FlashCardDocument = HydratedDocument<FlashCard>;
export const FlashCardSchema = SchemaFactory.createForClass(FlashCard);

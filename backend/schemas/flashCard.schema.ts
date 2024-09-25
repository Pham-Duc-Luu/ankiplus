import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { SRS } from './Srs.schema';

@Schema({ timestamps: true })
export class FlashCard {
    @Prop({ required: true, type: mongoose.Schema.Types.Mixed })
    front: any;

    @Prop({ required: true, type: mongoose.Schema.Types.Mixed })
    back: any;

    @Prop({ type: SRS })
    SRS: SRS;
}

export type FlashCardDocument = HydratedDocument<FlashCard>;
export const FlashCardSchema = SchemaFactory.createForClass(FlashCard);

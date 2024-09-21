import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';
import { FlashCard } from './flashCard.schema';

enum accessStatus {}

@Schema()
export class Collection {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ type: Boolean, default: true })
    isPublic: boolean = true;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'FlashCard' }] })
    newFlashCards: (FlashCard | string)[];

    @Prop({ type: [{ type: Types.ObjectId, ref: 'FlashCard' }] })
    waitedFlashCards: (FlashCard | string)[];

    @Prop({ type: [{ type: Types.ObjectId, ref: 'FlashCard' }] })
    previewingFlashCards: (FlashCard | string)[];

    @Prop({ type: Types.ObjectId, ref: 'User', required: true }) // Add reference to User
    owner: User; // Reference to the User schema
}

export type CollectionDocument = HydratedDocument<Collection>;
export const CollectionSchema = SchemaFactory.createForClass(Collection);

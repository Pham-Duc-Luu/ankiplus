import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';
import { FlashCard } from './flashCard.schema';

enum accessStatus {}

@Schema({
    timestamps: true,
})
export class Collection {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop({})
    description: string;

    @Prop({})
    thumnail: string;

    @Prop({ default: 'Icon' })
    icon: string;

    @Prop({ type: Boolean, default: true })
    isPublic: boolean = true;

    @Prop({ type: String, default: 'en' })
    language: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'FlashCard' }] })
    cards: (FlashCard | string)[];

    @Prop({ type: Types.ObjectId, ref: 'User', required: true }) // Add reference to User
    owner: User; // Reference to the User schema
}

export type CollectionDocument = HydratedDocument<Collection> & {
    createdAt: Date;
    updatedAt: Date;
};
export const CollectionSchema = SchemaFactory.createForClass(Collection);

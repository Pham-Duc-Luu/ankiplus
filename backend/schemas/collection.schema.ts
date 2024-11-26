import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId, Types } from 'mongoose';
import { User } from './user.schema';
import { FlashCard } from './flashCard.schema';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ListResponseDto } from 'dto/ListResponse.dto';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

enum accessStatus {}

@Schema({
    timestamps: true,
})
export class ReviewSession {
    /**
     *  a review session includes cards that have review date after today
     */
    @Prop({ type: [{ type: Types.ObjectId, ref: 'FlashCard' }] })
    cards?: (FlashCard | string)[];
}

@Schema({
    timestamps: true,
})
export class Collection {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop({})
    description?: string;

    @Prop({})
    thumbnail?: string;

    @Prop({ default: 'Icon' })
    icon?: string;

    @Prop({ type: Boolean, default: true })
    @IsBoolean()
    @IsOptional()
    isPublic: boolean;

    @Prop({ type: String, default: 'en' })
    @IsString()
    @IsOptional()
    language: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'FlashCard' }] })
    cards?: (FlashCard | string | Types.ObjectId)[];

    @Prop({ type: ReviewSession })
    reviewSession?: ReviewSession;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true }) // Add reference to User
    owner: User | string; // Reference to the User schema
}

export type CollectionDocument = HydratedDocument<Collection> & {
    createdAt: Date;
    updatedAt: Date;
};
export const CollectionSchema = SchemaFactory.createForClass(Collection);

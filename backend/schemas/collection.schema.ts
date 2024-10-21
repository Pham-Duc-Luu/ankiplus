import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';
import { FlashCard } from './flashCard.schema';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ListResponseDto } from 'dto/ListResponse.dto';

enum accessStatus {}

@Schema({
    timestamps: true,
})
export class Collection {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop({})
    description?: string;

    @Prop({})
    thumnail?: string;

    @Prop({ default: 'Icon' })
    icon?: string;

    @Prop({ type: Boolean, default: true })
    isPublic: boolean = true;

    @Prop({ type: String, default: 'en' })
    language: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'FlashCard' }] })
    cards?: (FlashCard | string)[];

    @Prop({ type: Types.ObjectId, ref: 'User', required: true }) // Add reference to User
    owner: User | string; // Reference to the User schema
}

export type CollectionDocument = HydratedDocument<Collection> & {
    createdAt: Date;
    updatedAt: Date;
};
export const CollectionSchema = SchemaFactory.createForClass(Collection);

@ObjectType()
export class CollectionQueryGQLObject extends ListResponseDto<CollectionGQLObject> {
    @Field((type) => Int)
    total: number;
    @Field((type) => Int)
    skip: number;
    @Field((type) => Int)
    limit: number;

    @Field((type) => [CollectionGQLObject])
    data: CollectionGQLObject[];
}

@ObjectType()
export class CollectionGQLObject extends Collection {
    @Field((type) => String)
    _id: string;

    @Field((type) => String)
    name: string;

    @Field((type) => String, { nullable: true })
    description?: string;

    @Field((type) => String, { nullable: true })
    thumnail?: string;

    @Field((type) => String, { nullable: true })
    icon: string;

    @Field((type) => Boolean, { nullable: true })
    isPublic: boolean = true;

    @Field((type) => String, { nullable: true })
    language: string;

    @Field((type) => [String], { nullable: true }) // Reference to the FlashCard schema (in the form of string IDs)
    cards?: string[];

    @Field((type) => String)
    owner: string; // Reference to the User schema

    @Field((type) => Date)
    createdAt: Date;

    @Field((type) => Date)
    updatedAt: Date;
}

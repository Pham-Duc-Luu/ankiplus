import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class SRS {
    @Prop({ type: Date, default: Date.now })
    nextReviewDate: Date;

    @Prop({ type: Number, default: 0 })
    interval: number;

    @Prop({ type: Number, default: 2.5 })
    efactor: number;
}

export type SRSDocument = HydratedDocument<SRS>;
export const SRSSchema = SchemaFactory.createForClass(SRS);

@ObjectType()
export class SRSGQLObject extends SRS {
    @Field((type) => String)
    _id: string;

    @Field((type) => Date) nextReviewDate: Date;

    @Field((type) => Number)
    interval: number;

    @Field((type) => Number)
    efactor: number;
}

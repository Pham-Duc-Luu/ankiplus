import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { SRS, SRSGQLObject } from './Srs.schema';
import { Collection } from './collection.schema';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ListResponseDto } from 'dto/ListResponse.dto';

@Schema({ timestamps: true })
export class FlashCard {
    @Prop({ required: true, type: mongoose.Schema.Types.Mixed })
    front: any;

    @Prop({ required: true, type: mongoose.Schema.Types.Mixed })
    back: any;

    @Prop({
        type: SRS,
        default: {
            nextReviewDate: new Date(), // Default current date
            interval: 0, // Default interval
            efactor: 2.5, // Default e-factor
        },
    })
    SRS: SRS;
    @Prop({ type: Types.ObjectId, ref: 'collection' })
    inCollection: String | Collection;
}

export type FlashCardDocument = HydratedDocument<FlashCard> & {
    createdAt: Date;
    updatedAt: Date;
};
export const FlashCardSchema = SchemaFactory.createForClass(FlashCard);

@ObjectType()
export class FlashCardGQLObject extends FlashCard {
    @Field((type) => String)
    _id: string;

    @Field((type) => String)
    front: any;

    @Field((type) => String)
    back: any;

    @Field((type) => SRSGQLObject)
    SRS: SRS;

    @Field((type) => String, { nullable: true })
    inCollection: String;
}

@ObjectType()
export class FlashCardQueryGQLObject extends ListResponseDto<FlashCardGQLObject> {
    @Field((type) => Int)
    total: number;
    @Field((type) => Int)
    skip: number;
    @Field((type) => Int)
    limit: number;

    @Field((type) => [FlashCardGQLObject])
    data: FlashCardGQLObject[];
}

@ObjectType()
export class NeedToReviewFlashCardGQLObject extends ListResponseDto<FlashCardGQLObject> {
    @Field((type) => Int)
    total: number;
    @Field((type) => Int)
    skip: number;
    @Field((type) => Int)
    limit: number;

    @Field((type) => [FlashCardGQLObject])
    data: FlashCardGQLObject[];
}

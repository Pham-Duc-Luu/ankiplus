import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Collection } from './collection.schema';
import { Token } from './token.schema';

@Schema()
export class User {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({})
    password: string;

    @Prop()
    isGoogleUser: boolean;

    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Collection' }] })
    collections: (Collection | string | Types.ObjectId)[]; // Array of ObjectId references to Collection

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Token' }] })
    Tokens?: (Token | string)[]; // Array of ObjectId references to Collection
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);

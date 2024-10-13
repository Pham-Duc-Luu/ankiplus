import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { User } from './user.schema';

@Schema({ timestamps: true })
export class Token {
    @Prop({ type: String })
    token: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true }) // Add reference to User
    user_token: User | string; // Store user id instead of string
}

export type TokenDocument = HydratedDocument<Token>;
export const TokenSchema = SchemaFactory.createForClass(Token);

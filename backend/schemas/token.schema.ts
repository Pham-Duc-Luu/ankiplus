import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Token {
    @Prop({ type: String })
    token: string;

    @Prop({ type: Types.ObjectId || String, ref: 'User' })
    user_token: Types.ObjectId; // Store user id instead of string
}

export type TokenDocument = HydratedDocument<Token>;
export const TokenSchema = SchemaFactory.createForClass(Token);

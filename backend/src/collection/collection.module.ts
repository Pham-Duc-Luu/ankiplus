import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Collection, CollectionSchema } from 'schemas/collection.schema';
import { User, UserSchema } from 'schemas/user.schema';
import { CollectionController } from './collection.controller';
import { StudyCollectionController } from './study.collection.controller';
import { CollectionService } from './collection.service';
import { FlashCard, FlashCardSchema } from 'schemas/flashCard.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Collection.name, schema: CollectionSchema },
            { name: FlashCard.name, schema: FlashCardSchema },
        ]),
    ],
    controllers: [CollectionController, StudyCollectionController],
    providers: [CollectionService],
})
export class CollectionModule {}

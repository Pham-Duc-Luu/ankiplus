import { Module } from '@nestjs/common';
import { UserAuthController } from './user.auth.controller';
import { UtilService } from 'src/app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'schemas/user.schema';
import { Collection, CollectionSchema } from 'schemas/collection.schema';
import { FlashCard, FlashCardSchema } from 'schemas/flashCard.schema';
import { UserCollectionController } from './collection/user.collection.controller';
import { UserFlashCardController } from './flashcard/user.flashCard.controller';
import { LoggerModule } from 'src/logger/logger.module';
import { WinstonLoggerService } from 'src/logger/logger.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Collection.name, schema: CollectionSchema },
            { name: FlashCard.name, schema: FlashCardSchema },
        ]),
        LoggerModule,
    ],
    controllers: [UserAuthController, UserCollectionController, UserFlashCardController],
    providers: [UtilService],
})
export class UserAuthModule {}

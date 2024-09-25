import { Module } from '@nestjs/common';
import { UserAuthController } from './user.auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'schemas/user.schema';
import { Collection, CollectionSchema } from 'schemas/collection.schema';
import { FlashCard, FlashCardSchema } from 'schemas/flashCard.schema';
import { UserCollectionController } from './collection/user.collection.controller';
import { UserFlashCardController } from './flashcard/user.flashCard.controller';
import { LoggerModule } from 'src/logger/logger.module';
import { WinstonLoggerService } from 'src/logger/logger.service';
import { UtilService } from 'src/util/util.service';
import { UserFlashCardService } from './flashcard/user.flashCard.service';
import { SRSService } from './flashcard/Srs.flashCard.service';

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
    providers: [UtilService, UserFlashCardService, SRSService],
})
export class UserAuthModule {}

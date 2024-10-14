import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'schemas/user.schema';
import { AppModule } from 'src/app.module';
import { UtilService } from 'src/util/util.service';
import { Token, TokenSchema } from 'schemas/token.schema';
import { LoggerModule } from 'libs/logger/logger/infrastructure/nestjs/loggerModule';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            {
                name: Token.name,
                schema: TokenSchema,
            },
        ]),

        LoggerModule,
    ],
    controllers: [UserController],
    providers: [UserService, UtilService],
})
export class UserModule {}

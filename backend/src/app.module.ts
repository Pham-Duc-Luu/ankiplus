import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from 'config/configuration';
import { JwtModule } from '@nestjs/jwt';
import { CollectionModule } from './collection/collection.module';
import { UserModule } from './user/user.module';
import { HttpExceptionFilter } from './middleware/http-exception.filter';
import { LoggerModule } from './logger/logger.module';
import { UtilModule } from './util/util.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration], // Makes the .env configuration available globally
            isGlobal: true,
        }),
        JwtModule.registerAsync({
            global: true,
            useFactory: async (configService: ConfigService) => {
                return {
                    secret: configService.get<string>('jwtConstant.secret'),
                    // signOptions: { expiresIn: configService.get<string>('jwtConstant.expiresIn') },
                };
            },
            inject: [ConfigService],
        }),
        MongooseModule.forRootAsync({
            useFactory: async (configService: ConfigService) => {
                return {
                    uri: configService.get<string>('database.mongodb.url'),
                };
            },
            inject: [ConfigService],
        }),
        AuthModule,
        CollectionModule,
        UserModule,
        LoggerModule,
        UtilModule,
    ],
    controllers: [AppController],
    providers: [AppService],
    exports: [],
})
export class AppModule {}

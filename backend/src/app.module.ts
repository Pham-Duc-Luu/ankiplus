import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import configuration from ' config/configuration';
import { JwtModule } from '@nestjs/jwt';
import { CollectionModule } from './collection/collection.module';
import { UserModule } from './user/user.module';
import { HttpExceptionFilter } from './middleware/http-exception.filter';
import { UtilModule } from './util/util.module';
import { LoggerModule } from 'libs/logger/logger/infrastructure/nestjs/loggerModule';
import { ConfigModule } from 'libs/logger/config/infrastructure/nestjs/configModule';
import { ContextModule } from 'libs/logger/context/infrastructure/nestjs/contextModule';
import { APP_FILTER } from '@nestjs/core';
// import { LoggerModule } from '@nestjs-logger/shared/logger/infrastructure/nestjs/loggerModule';
// import { ConfigModule } from '@nestjs-logger/shared/config/infrastructure/nestjs/configModule';
// import { ContextModule } from '@nestjs-logger/shared/context/infrastructure/nestjs/contextModule';
// LoggerModule, ConfigModule, ContextModule
@Module({
    imports: [
        // ConfigModule.forRoot({
        //     load: [configuration], // Makes the .env configuration available globally
        //     isGlobal: true,
        // }),
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
                    uri: configService.get<string>('database.mongodb_main.url'),
                    connectionFactory: (connection) => {
                        return connection;
                    },
                };
            },
            connectionName: configuration().database.mongodb_main.name,
            inject: [ConfigService],
        }),
        MongooseModule.forRootAsync({
            useFactory: async (configService: ConfigService) => {
                return {
                    uri: configService.get<string>('database.mongodb_bin.url'),
                    connectionFactory: (connection) => {
                        return connection;
                    },
                };
            },
            connectionName: configuration().database.mongodb_bin.name,

            inject: [ConfigService],
        }),
        // UserAuthModule,
        CollectionModule,
        UserModule,
        LoggerModule,
        ConfigModule,
        ContextModule,
        UtilModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
    ],
    exports: [],
})
export class AppModule {}

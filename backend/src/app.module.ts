import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import configuration from ' config/configuration';
import { JwtModule } from '@nestjs/jwt';
import { CollectionModule } from './collection/collection.module';
import { UserModule } from './user/user.module';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { UtilModule } from './util/util.module';
import { LoggerModule } from 'libs/logger/logger/infrastructure/nestjs/loggerModule';
import { ConfigModule } from 'libs/logger/config/infrastructure/nestjs/configModule';
import { ContextModule } from 'libs/logger/context/infrastructure/nestjs/contextModule';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { GqlThrottlerGuard } from './guard/GqlThrottlerGuard';
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
        AuthModule,
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
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            useGlobalPrefix: true,
            playground: true,
            // plugins: [ApolloServerPluginLandingPageLocalDefault()],
            autoSchemaFile: join(process.cwd(), 'schema.gql'),
            buildSchemaOptions: {
                fieldMiddleware: [],
            },
            // formatError: (error) => {
            //     console.log(error);

            //     const graphQLError = {
            //         message: error.message,
            //         path: error.path,
            //         locations: error.locations,
            //         extensions: {
            //             code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
            //             originalError: error.extensions?.exception || null,
            //         },
            //     };
            //     return graphQLError;
            // },
            context: ({ req }) => ({ req }), // This ensures that the request object is available in the GraphQL context
        }),
        ThrottlerModule.forRoot([
            {
                ttl: 60000,
                limit: 10,
            },
        ]),
        ScheduleModule.forRoot(),
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

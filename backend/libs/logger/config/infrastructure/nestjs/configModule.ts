import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ConfigService } from 'libs/logger/config/domain/services/configService';
import configuration from ' config/configuration';

@Global()
@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
    ],
    controllers: [],
    providers: [ConfigService],
    exports: [ConfigService],
})
export class ConfigModule {}

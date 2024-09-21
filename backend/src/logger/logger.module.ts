import { Global, Module } from '@nestjs/common';
import { WinstonLoggerService } from './logger.service';

@Global()
@Module({
    providers: [WinstonLoggerService],
    exports: [WinstonLoggerService],
})
export class LoggerModule {}

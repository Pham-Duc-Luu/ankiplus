// src/logger/logger.service.ts

import { Injectable } from '@nestjs/common';
import { WinstonLogger } from './winston.config';
import { ConfigService } from '@nestjs/config';
import winston from 'winston';

@Injectable()
export class WinstonLoggerService {
    private logger: winston.Logger;
    constructor(private configService: ConfigService) {
        this.logger = new WinstonLogger()
            .addTransportConsole()
            .addTransportDailyRotateFile()
            .addTransportMongoDb({ db: configService.get<string>('database.mongodb.url') })
            //   .addTransportSlackHook()
            .build();
    }
    log(message: string, context?: string) {
        this.logger.info(message, { context });
    }

    error(message: string, trace?: string, context?: string) {
        this.logger.error(message, { context, trace });
    }

    warn(message: string, context?: string) {
        this.logger.warn(message, { context });
    }

    debug(message: string, context?: string) {
        this.logger.debug(message, { context });
    }
}

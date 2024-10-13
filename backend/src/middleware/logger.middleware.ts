import { Injectable, NestMiddleware, Req } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as morgan from 'morgan';
import { WinstonLogger } from 'src/logger/winston.config';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const logger = new WinstonLogger().addTransportConsole().build();
        morgan('combined', {
            stream: { write: (str) => logger.info(str) },
        })(req, res, next);

        next();
    }
}

export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
    const logger = new WinstonLogger().addTransportConsole().build();

    logger.info(`${req.method} : ${req.url}`);
    next();
}

import { Injectable, NestMiddleware, Req } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { WinstonLogger } from 'src/logger/winston.config';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const logger = new WinstonLogger().addTransportConsole().build();
        logger.info(req.url);
        next();
    }
}

export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
    const logger = new WinstonLogger().addTransportConsole().build();

    logger.info(`${req.method} : ${req.url}\n`);
    next();
}

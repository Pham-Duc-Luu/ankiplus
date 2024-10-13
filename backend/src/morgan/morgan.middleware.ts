import { Injectable, NestMiddleware } from '@nestjs/common';
import { WinstonLogger } from 'src/logger/winston.config';
import * as morgan from 'morgan';

const morganlogger = new WinstonLogger().addTransportConsole().build();

export const morganMiddleware = morgan(':method :url :status :res[content-length] - :response-time ms', {
    stream: {
        // Configure Morgan to use our custom logger with the http severity
        write: (message) => morganlogger.http(message.trim()),
    },
});

// @Injectable()
// export class MorganMiddleware implements NestMiddleware {
//     use(req: any, res: any, next: () => void) {
//         morganMiddleware(req, res, next); // Use 'combined', 'dev', or custom format
//     }
// }

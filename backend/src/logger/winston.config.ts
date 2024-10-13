// src/logger/winston.config.ts

import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as SlackHook from 'winston-slack-webhook-transport';
import * as winstonMongoDB from 'winston-mongodb';
import DailyRotateFile from 'winston-daily-rotate-file';

// Create transports instance
const transports = [
    new winston.transports.Console({
        format: winston.format.combine(
            // Add a timestamp to the console logs
            winston.format.timestamp(),
            // Add colors to you logs
            winston.format.colorize(),
            // What the details you need as logs
            winston.format.printf(({ timestamp, level, message, context, trace }) => {
                return `${timestamp} [${context}] ${level}: ${message}${trace ? `\n${trace}` : ''}`;
            }),
        ),
    }),
    new winston.transports.DailyRotateFile({
        filename: 'logs/application-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    }),
    new SlackHook({
        webhookUrl: 'YOUR_SLACK_WEBHOOK_URL',
        channel: '#logs',
        username: 'LoggerBot',
        level: 'error',
        format: winston.format.combine(
            winston.format.timestamp(), // Add a timestamp to Slack logs
            winston.format.printf(({ timestamp, level, message, context, trace }) => {
                return `${timestamp} [${context}] ${level}: ${message}${trace ? `\n${trace}` : ''}`;
            }),
        ),
    }),
    new winstonMongoDB.MongoDB({
        level: 'info',
        db: 'mongodb://localhost:27017/your-database-name',
        options: {
            useUnifiedTopology: true,
        },
        collection: 'logs',
        format: winston.format.combine(
            winston.format.timestamp(), // Add a timestamp to MongoDB logs
            winston.format.json(), // Use JSON format for MongoDB logs
        ),
    }),
];

// Create and export the logger instance
export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports,
});

export class WinstonLogger {
    private loggerTransport: winston.transport[] = [new winston.transports.Console()];
    private loggerLevel: winston.LoggerOptions['level'] = 'info';
    private loggerFormat: winston.LoggerOptions['format'] = winston.format.json();
    constructor() {}

    public addTransportConsole(options?: winston.transports.ConsoleTransportOptions) {
        this.loggerTransport.push(
            new winston.transports.Console({
                format: winston.format.combine(
                    // Add a timestamp to the console logs
                    winston.format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }),
                    // Add colors to you logs
                    winston.format.colorize({ all: true }),
                    winston.format.align(),
                    // What the details you need as logs
                    winston.format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`),
                ),
                ...options,
            }),
        );

        return this;
    }

    public addTransportSlackHook(options?: SlackHook.SlackHookOptions) {
        this.loggerTransport.push(
            new SlackHook({
                webhookUrl: 'YOUR_SLACK_WEBHOOK_URL',
                channel: '#logs',
                username: 'LoggerBot',
                level: 'error',
                format: winston.format.combine(
                    winston.format.timestamp(), // Add a timestamp to Slack logs
                    winston.format.printf(({ timestamp, level, message, context, trace }) => {
                        return `${timestamp} [${context}] ${level}: ${message}${trace ? `\n${trace}` : ''}`;
                    }),
                ),
                ...options,
            }),
        );
        return this;
    }

    public addTransportDailyRotateFile(options?: DailyRotateFile.DailyRotateFileTransportOptions) {
        this.loggerTransport.push(
            new winston.transports.DailyRotateFile({
                filename: 'logs/application-%DATE%.log',
                datePattern: 'YYYY-MM-DD',
                zippedArchive: true,
                maxSize: '20m',
                maxFiles: '14d',
                format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
                options,
            }),
        );
        return this;
    }

    public addTransportMongoDb(options?: winstonMongoDB.MongoDBConnectionOptions) {
        this.loggerTransport.push(
            new winstonMongoDB.MongoDB({
                level: 'info',
                options: {
                    useUnifiedTopology: true,
                },
                collection: 'logs',
                format: winston.format.combine(
                    winston.format.timestamp(), // Add a timestamp to MongoDB logs
                    winston.format.json(), // Use JSON format for MongoDB logs
                ),
                ...options,
            }),
        );
        return this;
    }

    public build() {
        return winston.createLogger({
            level: this.loggerLevel,
            format: this.loggerFormat,
            transports: this.loggerTransport,
        });
    }
}

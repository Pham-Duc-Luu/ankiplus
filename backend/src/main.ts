import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { loggerMiddleware, LoggerMiddleware } from './middleware/logger.middleware';
import { HttpExceptionFilter } from './middleware/http-exception.filter';
import { AllExceptionsFilter } from './middleware/every-http-exception.filter';
import { LoggingInterceptor } from './Interceptor/logger.interceptor';
import helmet from 'helmet';
import { morganMiddleware } from './morgan/morgan.middleware';
import morgan from 'morgan';
import * as compression from 'compression';
import NestjsLoggerServiceAdapter from 'libs/logger/logger/infrastructure/nestjs/nestjsLoggerServiceAdapter';
async function bootstrap() {
    const app = await NestFactory.create(AppModule, { bufferLogs: true });
    const configService = app.get(ConfigService);
    const config = new DocumentBuilder().build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    app.enableCors();

    app.use(helmet());
    app.useLogger(app.get(NestjsLoggerServiceAdapter));

    // app.useGlobalInterceptors(new LoggingInterceptor());
    // app.useGlobalFilters(new HttpExceptionFilter());
    app.use(compression());
    await app.listen(configService.get('port'));
}
bootstrap();

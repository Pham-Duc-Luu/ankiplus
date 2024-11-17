import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import * as compression from 'compression';
import NestjsLoggerServiceAdapter from 'libs/logger/logger/infrastructure/nestjs/nestjsLoggerServiceAdapter';
import { TimeoutInterceptor } from './Interceptor/timeout.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { DelayInterceptor } from './Interceptor/delay.interceptor';
async function bootstrap() {
    const app = await NestFactory.create(AppModule, { bufferLogs: true });
    app.setGlobalPrefix('api/v1');

    const configService = app.get(ConfigService);
    const config = new DocumentBuilder().build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    app.use(cookieParser());
    /**
     * ! TURN OFF FOR DEVELOPMENT ONLY
     *  app.enableCors();
     * app.use(compression());
     * app.use(helmet());
     */
    app.enableCors({
        origin: 'http://localhost:3000',
        credentials: true,
    });

    app.useGlobalPipes(new ValidationPipe());
    app.useLogger(app.get(NestjsLoggerServiceAdapter));
    app.useGlobalInterceptors(new TimeoutInterceptor(5000)); // 5000ms = 5 seconds
    // app.useGlobalInterceptors(new LoggingInterceptor());
    // app.useGlobalFilters(new HttpExceptionFilter());
    // app.useGlobalInterceptors(new DelayInterceptor(2000));
    await app.listen(configService.get('port'));
}
bootstrap();

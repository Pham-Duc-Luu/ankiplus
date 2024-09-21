import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { loggerMiddleware, LoggerMiddleware } from './middleware/logger.middleware';
import { HttpExceptionFilter } from './middleware/http-exception.filter';
import { AllExceptionsFilter } from './middleware/every-http-exception.filter';
import { LoggingInterceptor } from './Interceptor/logger.interceptor';
import helmet from 'helmet';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const config = new DocumentBuilder().build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    app.enableCors();
    app.use(helmet());
    app.use(loggerMiddleware);
    // app.useGlobalInterceptors(new LoggingInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.listen(configService.get('port'));
}
bootstrap();

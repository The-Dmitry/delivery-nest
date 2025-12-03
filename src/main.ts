import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import * as cookieParser from 'cookie-parser';
import { BaseInterceptor } from '@interceptors/base.interceptor';
import { BaseFilter } from '@filters/base.filter';
import { setupSwagger } from '@utils/setupSwagger';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { createRootAdmin } from '@utils/createRootAdmin';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new BaseInterceptor());
  app.useGlobalFilters(new BaseFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  setupSwagger(app);
  await app.listen(process.env.PORT ?? 3000);
  await createRootAdmin(app);
}
bootstrap();

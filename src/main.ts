import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import * as cookieParser from 'cookie-parser';
import { BaseInterceptor } from '@interceptors/base.interceptor';
import { BaseFilter } from '@filters/base.filter';
import { setupSwagger } from '@utils/setupSwagger';
import { ClassSerializerInterceptor } from '@nestjs/common';

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
  setupSwagger(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

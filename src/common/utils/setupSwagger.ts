import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('NestJS Delivery Docs')
    .setDescription('The Delivery API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
        description: 'Enter JWT token in the "Bearer <token>" format',
      },
      'access-token',
    )
    .addCookieAuth(
      'jwt-refresh',
      {
        type: 'apiKey',
        in: 'cookie',
        name: 'jwt',
        description: 'Token for JWT refresh',
      },
      'refresh-token',
    )
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);
};

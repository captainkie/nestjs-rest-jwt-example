import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.setGlobalPrefix(configService.get<string>('app.API_PATH', 'api'));

  const config = new DocumentBuilder()
    .setTitle(configService.get<string>('app.DOCUMENT_TITLE', 'API Title'))
    .setDescription(
      configService.get<string>('app.DOCUMENT_DESCRIPTION', 'API Descriptions'),
    )
    .setVersion(configService.get<string>('app.DOCUMENT_VERSION', '1.0.0'))
    .addTag(configService.get<string>('app.DOCUMENT_TAG', 'API'))
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(
    configService.get<string>('app.DOCUMENT_URI', 'documents'),
    app,
    document,
    {
      swaggerOptions: {
        defaultModelsExpandDepth: -1,
        docExpansion: 'none',
        persistAuthorization: true,
        operationsSorter: 'alpha',
        tagsSorter: {
          alpha: (a: any, b: any) => a.localeCompare(b),
        },
      },
    },
  );

  await app.listen(configService.get<number>('app.APP_PORT', 3000));
}
bootstrap();

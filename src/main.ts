import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsOrigin = process.env.CORS_ORIGIN ?? true;
  const swaggerPath = process.env.SWAGGER_PATH ?? 'api';

  app.enableCors({
    origin: corsOrigin === '*' ? true : corsOrigin,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

  const config = new DocumentBuilder()
    .setTitle('CGV CV Block API')
    .setDescription('FE의 CV 블록 시스템에 맞춘 프로필, 섹션, 블록, 공유 링크 API')
    .setVersion('1.0.0')
    .addTag('users', 'CV 프로필 및 공유 링크 API')
    .addTag('sections', '섹션, 카테고리, 섹션/블록 정렬 API')
    .addTag('blocks', '활동/성과/프로젝트/학습 블록 API')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerPath, app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

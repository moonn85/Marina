import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RequestMethod, ValidationPipe, VersioningType } from '@nestjs/common';
import { AllExceptionsFilter } from './response/HttpException.filter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS configuration: Enable CORS cho development, production sẽ dùng nginx
  if (process.env.NODE_ENV !== 'production') {
    app.enableCors({
      origin: (origin, callback) => {
        // Cho phép tất cả localhost origins trong development
        if (!origin || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
          callback(null, true);
        } else {
          callback(null, false);
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    });
  }
  // Production: CORS được xử lý bởi nginx để tránh duplicate headers

  app.useGlobalFilters(new AllExceptionsFilter());
  app.setGlobalPrefix('api', {
    exclude: ['docs', 'app', { path: '/', method: RequestMethod.GET }],
  });
  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Marina API')
    .setDescription('API for the Marina hotel website')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3000;
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,        // ⭐ Bật transform
      transformOptions: {
        enableImplicitConversion: true,  // ⭐ Thêm dòng này
      },
    }),
  );
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();

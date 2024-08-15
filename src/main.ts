import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  app.setGlobalPrefix('api');
  await app.listen(3000);
}
bootstrap();

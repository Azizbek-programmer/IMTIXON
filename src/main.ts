import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { UserService } from './user/user.service';
import { LanguageService } from './language/language.service';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.setGlobalPrefix('api');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Auth API')
    .setDescription('Foydalanuvchi avtorizatsiyasi va roʻyxatdan oʻtish')
    .setVersion('1.0')
    .addTag('auth')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT');

  await app.listen(PORT ?? 4040, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}/docs`);
  });

  const userService = app.get(UserService);
  const languageService = app.get(LanguageService);
  await languageService.createDefaultLanguages();
  await userService.createSuperAdminData();
}
bootstrap();
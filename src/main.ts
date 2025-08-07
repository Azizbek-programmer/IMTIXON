import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { UserService } from './user/user.service';
import { LanguageService } from './language/language.service';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './common/logging/winston.logging';
import { AllExceptionFilter } from './common/errors/error.handling';
import { PrismaService } from './prisma/prisma.service';
import { CategoryService } from './category/category.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
      logger: WinstonModule.createLogger(winstonConfig),
  });


  app.use(cookieParser());
  app.setGlobalPrefix('api');



  const swaggerConfig = new DocumentBuilder()
    .setTitle('Auth API')
    .setDescription('Foydalanuvchi avtorizatsiyasi va royxatdan otish')
    .setVersion('1.0')
    .addTag('auth')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalFilters(new AllExceptionFilter());

  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT');

  await app.listen(PORT ?? 4040, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}/docs`);
  });

  const userService = app.get(UserService);
  const categoryService = app.get(CategoryService);
  const languageService = app.get(LanguageService);
  await languageService.createDefaultLanguages();
  await categoryService.createDefaultCategories();
  await userService.createSuperAdminData();
  await userService.createSuperAdminData();
  await userService.createAdminData();
  await userService.createWorkerData();
}
bootstrap();




// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJheml6YmVrbWlyemF2YWxpeWV2MzFnbWFpbC5jb20iLCJyb2xlIjoiQ1VTVE9NRVIiLCJpc192ZXJpZmllZCI6dHJ1ZSwiaWF0IjoxNzU0NTYxMTUyLCJleHAiOjE3NTQ1NjIwNTJ9.gS1ovm5ct0meek-rmBGbtmFkTPGwRJACqYtmSZHpBuc
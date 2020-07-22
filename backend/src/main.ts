import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {NestExpressApplication} from "@nestjs/platform-express";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: "*"
  })
  app.use(function (req, res, next) {
    res.header('X-Powered-By', 'ur mom');
    next();
  });
  await app.listen(8080);
}

bootstrap();

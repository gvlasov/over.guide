import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {NestExpressApplication} from "@nestjs/platform-express";
import {readFileSync} from 'fs'

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(
        AppModule,
        {
            httpsOptions: {
                key: readFileSync('./src/test/server.key'),
                cert: readFileSync('./src/test/server.crt'),
            }
        }
    );
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

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
    const cors = {
        origin: "*"
    };
    app.enableCors(cors)
    app.use(function (req, res, next) {
        res.header('X-Powered-By', 'ur mom');
        next();
    });
    await app.listen(8080);
}

bootstrap();

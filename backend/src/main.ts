import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {NestExpressApplication} from "@nestjs/platform-express";

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(
        AppModule
    );
    const cors = {
        origin: "*"
    };
    app.enableCors(cors)
    app.use(function (req, res, next) {
        res.header('X-Powered-By', 'ur mom');
        next();
    });
    app.use((err, req, res, next) => {
        if (res.headersSent) {
            return next(err)
        }
        res.status(500)
        res.render('error', {error: err})
    })
    await app.listen(8080);
}

bootstrap();

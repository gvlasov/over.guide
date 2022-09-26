"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const cors = {
        origin: "*"
    };
    app.enableCors(cors);
    app.use(function (req, res, next) {
        res.header('X-Powered-By', 'ur mom');
        next();
    });
    app.use((err, req, res, next) => {
        if (res.headersSent) {
            return next(err);
        }
        res.status(500);
        res.render('error', { error: err });
    });
    await app.listen(8080);
}
bootstrap();
//# sourceMappingURL=main.js.map
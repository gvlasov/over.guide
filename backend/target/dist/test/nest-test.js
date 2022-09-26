"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nestTest = void 0;
const testing_1 = require("@nestjs/testing");
const fixture_service_1 = require("../services/fixture.service");
const common_1 = require("@nestjs/common");
const app_module_config_1 = __importDefault(require("../app.module.config"));
const ini = __importStar(require("ini"));
const fs_jetpack_1 = __importDefault(require("fs-jetpack"));
class TestContext {
}
function nestTest(serviceToTest, call) {
    process.env = {
        ...process.env,
        ...ini.parse(fs_jetpack_1.default.read('config/test/env'))
    };
    return () => {
        const testContext = new TestContext();
        beforeEach(async () => {
            const app = await testing_1.Test.createTestingModule({
                imports: app_module_config_1.default.imports,
                controllers: app_module_config_1.default.controllers,
                providers: app_module_config_1.default.providers,
            }).compile();
            const fixtureService = app.get(fixture_service_1.FixtureService);
            testContext.service = app.get(serviceToTest);
            testContext.fixtures = async (...fixtures) => await fixtureService.loadFixturesClear(...fixtures);
            testContext.app = app.createNestApplication();
            await testContext.app.init()
                .then(app => {
                app.useGlobalPipes(new common_1.ValidationPipe({
                    skipUndefinedProperties: false,
                    forbidUnknownValues: true,
                    disableErrorMessages: false,
                    transform: true,
                }));
            });
        });
        afterEach(async () => {
            await testContext.app.close();
        });
        call(testContext);
    };
}
exports.nestTest = nestTest;
//# sourceMappingURL=nest-test.js.map
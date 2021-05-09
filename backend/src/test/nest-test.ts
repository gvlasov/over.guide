import {Test, TestingModule} from "@nestjs/testing";
import {Fixture, FixtureService} from "src/services/fixture.service";
import {INestApplication, Type, ValidationPipe} from "@nestjs/common";
import appModuleConfig from 'src/app.module.config'
import * as ini from 'ini'
import jetpack from "fs-jetpack";

class TestContext<T> {
    service: T
    fixtures: (...fixtures: Fixture[]) => void
    app: INestApplication
}

export function nestTest<T>(
    serviceToTest: Type<T>,
    call: (testContext: TestContext<T>) => void
) {
    process.env = {
        ...process.env,
        ...ini.parse(
            jetpack.read('config/test/env')
        )
    }
    return () => {
        const testContext = new TestContext<T>()

        beforeEach(async () => {
            const app: TestingModule = await Test.createTestingModule({
                imports: appModuleConfig.imports,
                controllers: appModuleConfig.controllers,
                providers: appModuleConfig.providers,
            }).compile();

            const fixtureService = app.get<FixtureService>(FixtureService);
            testContext.service = app.get<T>(serviceToTest);
            testContext.fixtures = async (...fixtures) =>
                await fixtureService.loadFixturesClear(...fixtures)
            testContext.app = app.createNestApplication()
            await testContext.app.init()
                .then(app => {
                    app.useGlobalPipes(new ValidationPipe({
                        skipUndefinedProperties: false,
                        forbidUnknownValues: true,
                        disableErrorMessages: false,
                        transform: true,
                    }))
                })

        });
        afterEach(async () => {
            await testContext.app.close()
        })

        call(testContext)
    };
}

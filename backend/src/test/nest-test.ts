import {Test, TestingModule} from "@nestjs/testing";
import {Fixture, FixtureService} from "src/services/fixture.service";
import {Provider} from "@nestjs/common/interfaces/modules/provider.interface";
import {INestApplication, Type} from "@nestjs/common";
import {databaseProviders} from "src/database/database.providers";

class TestContext<T> {
    service: T
    fixtures: (...fixtures: Fixture[]) => void
    app: INestApplication
}

export function nestTest<T>(
    serviceToTest: Type<T>,
    controllers: any[],
    providers: Provider[],
    call: (testContext: TestContext<T>) => void
) {
    return () => {
        let testContext = new TestContext<T>()
        const isController = serviceToTest.name.match(/Controller$/) !== null;

        const initialProviders: Provider[] = isController ? [serviceToTest] : [];
        const initialControllers = isController ? [serviceToTest] : [];

        beforeEach(async () => {
            const app: TestingModule = await Test.createTestingModule({
                controllers: initialControllers.concat(controllers),
                providers: initialProviders.concat(providers).concat([FixtureService, serviceToTest, ...databaseProviders])

            }).compile();

            const fixtureService = app.get<FixtureService>(FixtureService);
            testContext.service = app.get<T>(serviceToTest);
            testContext.fixtures = async (...fixtures) =>
                await fixtureService.loadFixturesClear(...fixtures)
            testContext.app = app.createNestApplication()
            await testContext.app.init()
        });

        call(testContext)
    };
}

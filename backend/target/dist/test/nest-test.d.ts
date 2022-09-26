import { Fixture } from "src/services/fixture.service";
import { INestApplication, Type } from "@nestjs/common";
declare class TestContext<T> {
    service: T;
    fixtures: (...fixtures: Fixture[]) => void;
    app: INestApplication;
}
export declare function nestTest<T>(serviceToTest: Type<T>, call: (testContext: TestContext<T>) => void): () => void;
export {};

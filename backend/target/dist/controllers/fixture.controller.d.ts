import { Fixture, FixtureService } from "src/services/fixture.service";
export declare class FixtureController {
    private readonly service;
    constructor(service: FixtureService);
    load(json: Fixture): void;
    clear(): void;
    loadDefault(): void;
    loadHuge(): void;
}

import { Model, Sequelize } from "sequelize-typescript";
import { ModuleRef } from "@nestjs/core";
export declare type Fixture = ((any: any) => void);
export declare function ActuallyNotTableButView<T extends Model>(constructor: new () => T): void;
export declare class FixtureService {
    private readonly sequelize;
    private readonly moduleRef;
    constructor(sequelize: Sequelize, moduleRef: ModuleRef);
    loadFixture(fixture: Fixture): Promise<any>;
    loadFixtureClear(fixture: Fixture): Promise<any>;
    loadFixturesClear(...fixtures: Fixture[]): Promise<void>;
    truncateTables(): void;
}

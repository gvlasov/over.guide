import { Sequelize } from 'sequelize-typescript';
import { ModuleRef } from "@nestjs/core";
export declare const databaseProviders: {
    provide: string;
    useFactory: (moduleRef: ModuleRef) => Promise<Sequelize>;
}[];

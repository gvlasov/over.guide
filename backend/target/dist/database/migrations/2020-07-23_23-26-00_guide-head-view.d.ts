import { ModuleRef } from "@nestjs/core";
import { Sequelize } from "sequelize-typescript";
export declare function up(moduleRef: ModuleRef, sequelize: Sequelize): Promise<void>;
export declare function down(moduleRef: ModuleRef, sequelize: Sequelize): Promise<void>;

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
exports.databaseProviders = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const constants_1 = require("../constants");
const cls_hooked_1 = __importDefault(require("cls-hooked"));
const database_models_1 = __importDefault(require("./database.models"));
const fs = __importStar(require("fs"));
const database_migrationDirChecker_1 = require("./database.migrationDirChecker");
const Umzug = require('umzug');
exports.databaseProviders = [
    {
        provide: constants_1.SEQUELIZE,
        useFactory: async (moduleRef) => {
            const host = process.env.DB_HOST || 'mariadb';
            const port = Number.parseInt(process.env.DB_PORT, 10) || 3306;
            const sequelize = new sequelize_typescript_1.Sequelize({
                dialect: 'mysql',
                host: host,
                port: port,
                username: process.env.DB_USER || 'root',
                password: process.env.DB_PASSWORD || '1',
                database: process.env.DB_NAME || 'overwatch',
                define: {
                    freezeTableName: true,
                },
                pool: {
                    min: 0,
                    max: 5,
                },
                dialectOptions: {
                    multipleStatements: true,
                },
                benchmark: true,
                logging: Number.parseInt(process.env.SQL_LOG) ? (...msg) => console.log(msg[0], ' — ' + msg[1] + ' ms') : false,
            });
            sequelize_typescript_1.Sequelize.useCLS(cls_hooked_1.default.createNamespace('sequelize'));
            sequelize.addModels(database_models_1.default);
            require('ts-node/register');
            let paths;
            if (process.env.ENV === 'prod') {
                paths = JSON.parse(Buffer.from(await fs.promises.readFile('./dist/tsconfig.prod.tsbuildinfo')).toString('utf8')).program.options.paths;
                for (const key in paths) {
                    paths[key] = paths[key].map(it => 'dist/' + it.substr('src/'.length));
                }
            }
            else {
                paths = require('../../tsconfig.json').compilerOptions.paths;
            }
            require('tsconfig-paths').register({
                baseUrl: './',
                paths: paths
            });
            const migrationsPattern = /\.js$/;
            database_migrationDirChecker_1.checkMigrationDir(process.env.MIGRATIONS_PATH, migrationsPattern);
            const umzug = new Umzug({
                migrations: {
                    path: process.env.MIGRATIONS_PATH,
                    pattern: migrationsPattern,
                    params: [
                        moduleRef,
                        sequelize,
                    ]
                },
                logging: console.log,
                storage: 'sequelize',
                storageOptions: {
                    sequelize: sequelize,
                }
            });
            await sequelize.sync({ alter: true }).then(() => umzug.up());
            return sequelize;
        },
    },
];
//# sourceMappingURL=database.providers.js.map
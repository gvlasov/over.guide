import {Sequelize} from 'sequelize-typescript';
import {SEQUELIZE} from '../constants';
import cls from 'cls-hooked';
import models from './database.models'
import {ModuleRef} from "@nestjs/core";

const Umzug = require('umzug')

export const databaseProviders = [
    {
        provide: SEQUELIZE,
        useFactory: async (moduleRef: ModuleRef) => {
            const host: string = process.env.DB_HOST || 'mariadb';
            const port: number = Number.parseInt(process.env.DB_PORT, 10) || 3306;
            const sequelize = new Sequelize({
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
            Sequelize.useCLS(
                cls.createNamespace('sequelize')
            )

            sequelize.addModels(models);
            // https://github.com/sequelize/umzug
            // Ctrl+F "You can also write your migrations in typescript"
            require('ts-node/register')
            const tsconfigPaths = require('tsconfig-paths')
            const tsconfig = require('../../tsconfig.json')
            tsconfigPaths.register({
                baseUrl: './',
                paths: tsconfig.compilerOptions.paths
            })
            const umzug = new Umzug({
                migrations: {
                    path: process.env.MIGRATIONS_PATH,
                    pattern: /\.ts$/,
                    params: [
                        moduleRef,
                        sequelize,
                    ]
                },
                storage: 'sequelize',
                storageOptions: {
                    sequelize: sequelize,
                }
            });
            await sequelize.sync().then(() => umzug.up())
            return sequelize;

        },
    },
];

import {Sequelize} from 'sequelize-typescript';
import {SEQUELIZE} from '../constants';
import cls from 'cls-hooked';
import models from './database.models'
import {ModuleRef} from "@nestjs/core";
import * as fs from "fs";

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
            let paths;


            if (process.env.ENV === 'prod') {
                paths = JSON.parse(Buffer.from(await fs.promises.readFile('./dist/tsconfig.prod.tsbuildinfo')).toString('utf8')).program.options.paths
                for (const key in paths) {
                    paths[key] = paths[key].map(it => 'dist/' + it.substr('src/'.length))
                }
            } else {
                paths = require('../../tsconfig.json').compilerOptions.paths
            }
            require('tsconfig-paths').register({
                baseUrl: './',
                paths: paths
            })
            const umzug = new Umzug({
                migrations: {
                    path: process.env.MIGRATIONS_PATH,
                    pattern: /\.js$/,
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
            await sequelize.sync({alter: true}).then(() => umzug.up())
            return sequelize;

        },
    },
];

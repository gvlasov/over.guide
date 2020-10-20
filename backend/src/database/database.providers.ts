import {Sequelize} from 'sequelize-typescript';
import {SEQUELIZE, SQL_LOG} from '../constants';
import cls from 'cls-hooked';
import PostTypeId from "data/PostTypeId";
import models from './database.models'

const Umzug = require('umzug')

export const databaseProviders = [
    {
        provide: SEQUELIZE,
        useFactory: async () => {
            const host: string = process.env.DB_HOST || 'mariadb';
            const port: number = Number.parseInt(process.env.DB_PORT, 10) || 3306;
            const sequelize = new Sequelize({
                dialect: 'mysql',
                host: host,
                port: port,
                username: 'root',
                password: '1',
                database: 'overwatch',
                define: {
                    freezeTableName: true,
                },
                pool: {
                    min: 0,
                    max: 2,
                },
                dialectOptions: {
                    multipleStatements: true,
                },
                benchmark: true,
                logging: SQL_LOG ? (...msg) => console.log(msg[0], ' — '+msg[1]+' ms') : false,

            });
            Sequelize.useCLS(
                cls.createNamespace('sequelize')
            )

            sequelize.addModels(models);
            const umzug = new Umzug({
                migrations: {
                    path: 'src/database/migrations',
                    params: [
                        sequelize.getQueryInterface(),
                        PostTypeId.Guide
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

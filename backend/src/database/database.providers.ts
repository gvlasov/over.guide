import {Sequelize} from 'sequelize-typescript';

import {SEQUELIZE} from '../constants';
import {Hero} from "./models/Hero";
import {Patch} from "./models/Patch";
import {Ability} from "./models/Ability";
import {MatchupEvaluation} from "./models/MatchupEvaluation";
import {YoutubeVideoExcerpt} from "./models/YoutubeVideoExcerpt";
import {User} from "src/database/models/User";

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
                dialectOptions: {
                    multipleStatements: true,
                },
                logging: false,
            });

            sequelize.addModels([
                Hero,
                Patch,
                Ability,
                MatchupEvaluation,
                YoutubeVideoExcerpt,
                User,
            ]);

            await sequelize.sync();
            return sequelize;
        },
    },
];

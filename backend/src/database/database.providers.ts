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
            const sequelize = new Sequelize({
                dialect: 'mysql',
                host: 'mariadb',
                port: 3306,
                username: 'root',
                password: '1',
                database: 'overwatch',
                define: {
                    freezeTableName: true,
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

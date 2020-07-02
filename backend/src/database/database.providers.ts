import {Sequelize} from 'sequelize-typescript';

import {SEQUELIZE} from '../constants';
import {Hero} from "./models/Hero";
import {Patch} from "./models/Patch";
import {Ability} from "./models/Ability";
import {MatchupEvaluation} from "./models/MatchupEvaluation";
import {YoutubeVideoExcerpt} from "./models/YoutubeVideoExcerpt";

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
                }
            });

            sequelize.addModels([
                Hero,
                Patch,
                Ability,
                MatchupEvaluation,
                YoutubeVideoExcerpt,
            ]);

            await sequelize.sync();
            return sequelize;
        },
    },
];

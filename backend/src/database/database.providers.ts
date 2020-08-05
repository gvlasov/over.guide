import {Sequelize} from 'sequelize-typescript';

import {SEQUELIZE, SQL_LOG} from '../constants';
import {Hero} from "./models/Hero";
import {Patch} from "./models/Patch";
import {Ability} from "./models/Ability";
import {MatchupEvaluation} from "./models/MatchupEvaluation";
import {YoutubeVideoExcerpt} from "./models/YoutubeVideoExcerpt";
import {User} from "src/database/models/User";
import {Guide} from "src/database/models/Guide";
import {GuideDescriptor} from "src/database/models/GuideDescriptor";
import {GuideDescriptor2AllyHero} from "src/database/models/GuideDescriptor2AllyHero";
import {GuideDescriptor2EnemyHero} from "src/database/models/GuideDescriptor2EnemyHero";
import {GuideDescriptor2Map} from "src/database/models/GuideDescriptor2Map";
import {GuideDescriptor2PlayerHero} from "src/database/models/GuideDescriptor2PlayerHero";
import {GuideDescriptor2ThematicTag} from "src/database/models/GuideDescriptor2ThematicTag";
import {GuideHistoryEntry} from "src/database/models/GuideHistoryEntry";
import {GuideHistoryEntry2GuidePartText} from "src/database/models/GuideHistoryEntry2GuidePartText";
import {GuideHistoryEntry2GuidePartVideo} from "src/database/models/GuideHistoryEntry2GuidePartVideo";
import {GuidePartText} from "src/database/models/GuidePartText";
import {GuidePartVideo} from "src/database/models/GuidePartVideo";
import {Map} from "src/database/models/Map";
import {ThematicTag} from "src/database/models/ThematicTag";
import cls from 'cls-hooked';
import {GuideHead} from "src/database/models/GuideHead";
import {GuideDescriptor2PlayerAbility} from "src/database/models/GuideDescriptor2PlayerAbility";
import {GuideDescriptor2AllyAbility} from "src/database/models/GuideDescriptor2AllyAbility";
import {GuideDescriptor2EnemyAbility} from "src/database/models/GuideDescriptor2EnemyAbility";

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
                dialectOptions: {
                    multipleStatements: true,
                },
                logging: SQL_LOG ? (...msg) => console.log(msg) : false,
            });
            Sequelize.useCLS(
                cls.createNamespace('sequelize')
            )

            sequelize.addModels([
                Hero,
                Patch,
                Ability,
                MatchupEvaluation,
                YoutubeVideoExcerpt,
                User,
                Guide,
                GuideDescriptor,
                GuideDescriptor2PlayerHero,
                GuideDescriptor2AllyHero,
                GuideDescriptor2EnemyHero,
                GuideDescriptor2PlayerAbility,
                GuideDescriptor2AllyAbility,
                GuideDescriptor2EnemyAbility,
                GuideDescriptor2Map,
                GuideDescriptor2ThematicTag,
                GuideHistoryEntry,
                GuideHistoryEntry2GuidePartText,
                GuideHistoryEntry2GuidePartVideo,
                GuidePartText,
                GuidePartVideo,
                Map,
                ThematicTag,
                GuideHead,
            ]);
            const umzug = new Umzug({
                migrations: {
                    path: 'src/database/migrations',
                    params: [
                        sequelize.getQueryInterface()
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

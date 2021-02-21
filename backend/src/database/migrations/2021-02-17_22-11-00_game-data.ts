import {ModuleRef} from "@nestjs/core";
import {Sequelize} from "sequelize-typescript";
import heroes from '@fixtures/heroes'
import thematicTags from '@fixtures/thematicTags'
import maps from '@fixtures/maps'
import abilities from '@fixtures/abilities'
import {ThematicTag} from "src/database/models/ThematicTag";
import {Hero} from "src/database/models/Hero";
import {Ability} from "src/database/models/Ability";
import {Map} from "src/database/models/Map";
import {QueryOptions} from "sequelize";


export async function up(moduleRef: ModuleRef, sequelize: Sequelize) {
    sequelize.addModels(
        [
            Hero,
            ThematicTag,
            Map,
            Ability
        ]
    )
    await sequelize.transaction(t => {
        const options: QueryOptions = {
            raw: true,
            transaction: t,

        }
        return sequelize
            .query('SET FOREIGN_KEY_CHECKS = 0', options)
            .then(() => sequelize.truncate(options))
            .then(() =>
                sequelize.query('SET FOREIGN_KEY_CHECKS = 1', options)
            )
            .then(heroes)
            .then(thematicTags)
            .then(maps)
            .then(abilities)
    })
}

export async function down(moduleRef: ModuleRef, sequelize: Sequelize) {
    await Hero.truncate()
    await ThematicTag.truncate()
    await Ability.truncate()
    await Map.truncate()
}

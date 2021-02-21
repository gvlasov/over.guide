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


export async function up(moduleRef: ModuleRef, sequelize: Sequelize) {
    sequelize.addModels(
        [
            Hero,
            ThematicTag,
            Map,
            Ability
        ]
    )
    await heroes()
    await thematicTags()
    await maps()
    await abilities()
}

export async function down(moduleRef: ModuleRef, sequelize: Sequelize) {
    Hero.truncate()
    ThematicTag.truncate()
    Ability.truncate()
    Map.truncate()
}

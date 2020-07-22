import {
    AutoIncrement,
    BelongsToMany,
    Column,
    Model,
    PrimaryKey,
    Table
} from 'sequelize-typescript';
import {Hero} from "src/database/models/Hero";
import {GuideDescriptor2PlayerHero} from "src/database/models/GuideDescriptor2PlayerHero";
import {GuideDescriptor2AllyHero} from "src/database/models/GuideDescriptor2AllyHero";
import {GuideDescriptor2EnemyHero} from "src/database/models/GuideDescriptor2EnemyHero";
import {Map} from "src/database/models/Map";
import {GuideDescriptor2Map} from "src/database/models/GuideDescriptor2Map";
import {ThematicTag} from "src/database/models/ThematicTag";
import {GuideDescriptor2ThematicTag} from "src/database/models/GuideDescriptor2ThematicTag";

@Table({
    name: {
        singular: 'GuideDescriptor',
        plural: 'GuideDescriptors',
    },
    updatedAt: false,
})
export class GuideDescriptor extends Model<GuideDescriptor> {

    @PrimaryKey
    @AutoIncrement
    @Column
    public id: number

    @BelongsToMany(() => Hero, () => GuideDescriptor2PlayerHero)
    players: Hero[]

    @BelongsToMany(() => Hero, () => GuideDescriptor2AllyHero)
    allies: Hero[]

    @BelongsToMany(() => Hero, () => GuideDescriptor2EnemyHero)
    enemies: Hero[]

    @BelongsToMany(
        () => Map,
        {
            through: {
                model: () => GuideDescriptor2Map,
            }
        }
    )
    maps: Map[]

    @BelongsToMany(
        () => ThematicTag,
        {
            through: {
                model: () => GuideDescriptor2ThematicTag,
            }
        }
    )
    thematicTags: ThematicTag[]

}
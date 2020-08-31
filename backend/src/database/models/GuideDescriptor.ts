import {
    AutoIncrement,
    BelongsToMany,
    Column,
    Model,
    PrimaryKey,
    Table,
    Unique
} from 'sequelize-typescript';
import {Hero} from "src/database/models/Hero";
import {GuideDescriptor2PlayerHero} from "src/database/models/GuideDescriptor2PlayerHero";
import {GuideDescriptor2AllyHero} from "src/database/models/GuideDescriptor2AllyHero";
import {GuideDescriptor2EnemyHero} from "src/database/models/GuideDescriptor2EnemyHero";
import {Map} from "src/database/models/Map";
import {GuideDescriptor2Map} from "src/database/models/GuideDescriptor2Map";
import {ThematicTag} from "src/database/models/ThematicTag";
import {GuideDescriptor2ThematicTag} from "src/database/models/GuideDescriptor2ThematicTag";
import {DataTypes} from "sequelize";
import GuideDescriptorDto from "data/dto/GuideDescriptorDto";
import {Ability} from "src/database/models/Ability";
import {GuideDescriptor2PlayerAbility} from "src/database/models/GuideDescriptor2PlayerAbility";
import {GuideDescriptor2AllyAbility} from "src/database/models/GuideDescriptor2AllyAbility";
import {GuideDescriptor2EnemyAbility} from "src/database/models/GuideDescriptor2EnemyAbility";

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

    @BelongsToMany(() => Ability, () => GuideDescriptor2PlayerAbility)
    playerAbilities: Ability[]

    @BelongsToMany(() => Hero, () => GuideDescriptor2AllyHero)
    teammates: Hero[]

    @BelongsToMany(() => Ability, () => GuideDescriptor2AllyAbility)
    teammateAbilities: Ability[]

    @BelongsToMany(() => Hero, () => GuideDescriptor2EnemyHero)
    enemies: Hero[]

    @BelongsToMany(() => Ability, () => GuideDescriptor2EnemyAbility)
    enemyAbilities: Ability[]

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

    @Unique
    @Column({type: new DataTypes.CHAR(32)})
    contentHash: string

    toDto(): GuideDescriptorDto {
        return {
            playerHeroes: this.players.map(hero => hero.id),
            playerAbilities: this.playerAbilities.map(ability => ability.id),
            teammateHeroes: this.teammates.map(hero => hero.id),
            teammateAbilities: this.teammateAbilities.map(ability => ability.id),
            enemyHeroes: this.enemies.map(hero => hero.id),
            enemyAbilities: this.enemyAbilities.map(ability => ability.id),
            mapTags: this.maps.map(map => map.id),
            thematicTags: this.thematicTags.map(tag => tag.id),
        } as GuideDescriptorDto
    }

}
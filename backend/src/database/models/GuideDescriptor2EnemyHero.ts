import {
    AllowNull,
    Column,
    ForeignKey,
    Model,
    Table,
} from 'sequelize-typescript';
import {Hero} from "src/database/models/Hero";
import {GuideDescriptor} from "src/database/models/GuideDescriptor";

@Table({
    name: {
        singular: 'GuideDescriptor2EnemyHero',
        plural: 'GuideDescriptor2EnemyHeroes',
    },
    createdAt: false,
    updatedAt: false,
})
export class GuideDescriptor2EnemyHero extends Model<GuideDescriptor2EnemyHero> {

    @AllowNull(false)
    @Column
    @ForeignKey(() => GuideDescriptor)
    guideDescriptorId: number

    @AllowNull(false)
    @Column
    @ForeignKey(() => Hero)
    heroId: number

}
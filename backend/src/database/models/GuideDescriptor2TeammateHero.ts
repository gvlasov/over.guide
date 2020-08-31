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
        singular: 'GuideDescriptor2TeammateHero',
        plural: 'GuideDescriptor2TeammateHeroes',
    },
    createdAt: false,
    updatedAt: false,
})
export class GuideDescriptor2TeammateHero extends Model<GuideDescriptor2TeammateHero> {

    @AllowNull(false)
    @ForeignKey(() => GuideDescriptor)
    @Column
    guideDescriptorId: number

    @AllowNull(false)
    @ForeignKey(() => Hero)
    @Column
    heroId: number

}
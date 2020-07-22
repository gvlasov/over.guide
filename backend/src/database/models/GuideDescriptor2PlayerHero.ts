import {ForeignKey, Model, Table,} from 'sequelize-typescript';
import {Hero} from "src/database/models/Hero";
import {GuideDescriptor} from "src/database/models/GuideDescriptor";

@Table({
    name: {
        singular: 'GuideDescriptor2PlayerHero',
        plural: 'GuideDescriptor2PlayerHeroes',
    },
    createdAt: false,
    updatedAt: false,
})
export class GuideDescriptor2PlayerHero extends Model<GuideDescriptor2PlayerHero> {

    @ForeignKey(() => GuideDescriptor)
    guideDescriptorId: number

    @ForeignKey(() => Hero)
    heroId: number

}
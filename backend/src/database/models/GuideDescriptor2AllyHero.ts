import {Column, ForeignKey, Model, Table,} from 'sequelize-typescript';
import {Hero} from "src/database/models/Hero";
import {GuideDescriptor} from "src/database/models/GuideDescriptor";

@Table({
    name: {
        singular: 'GuideDescriptor2AllyHero',
        plural: 'GuideDescriptor2AllyHeroes',
    },
    createdAt: false,
    updatedAt: false,
})
export class GuideDescriptor2AllyHero extends Model<GuideDescriptor2AllyHero> {

    @ForeignKey(() => GuideDescriptor)
    @Column
    guideDescriptorId: number

    @ForeignKey(() => Hero)
    @Column
    heroId: number

}
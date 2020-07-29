import {ForeignKey, Model, Table,} from 'sequelize-typescript';
import {GuideDescriptor} from "src/database/models/GuideDescriptor";
import {Ability} from "src/database/models/Ability";

@Table({
    name: {
        singular: 'GuideDescriptor2Ability',
        plural: 'GuideDescriptor2Abilities',
    },
    createdAt: false,
    updatedAt: false,
})
export class GuideDescriptor2Ability extends Model<GuideDescriptor2Ability> {

    @ForeignKey(() => GuideDescriptor)
    guideDescriptorId: number

    @ForeignKey(() => Ability)
    abilityId: number

}
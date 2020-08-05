import {ForeignKey, Model, Table,} from 'sequelize-typescript';
import {GuideDescriptor} from "src/database/models/GuideDescriptor";
import {Ability} from "src/database/models/Ability";

@Table({
    name: {
        singular: 'GuideDescriptor2AllyAbility',
        plural: 'GuideDescriptor2AllyAbilities',
    },
    createdAt: false,
    updatedAt: false,
})
export class GuideDescriptor2AllyAbility extends Model<GuideDescriptor2AllyAbility> {

    @ForeignKey(() => GuideDescriptor)
    guideDescriptorId: number

    @ForeignKey(() => Ability)
    abilityId: number

}
import {ForeignKey, Model, Table,} from 'sequelize-typescript';
import {GuideDescriptor} from "src/database/models/GuideDescriptor";
import {Ability} from "src/database/models/Ability";

@Table({
    name: {
        singular: 'GuideDescriptor2PlayerAbility',
        plural: 'GuideDescriptor2PlayerAbilities',
    },
    createdAt: false,
    updatedAt: false,
})
export class GuideDescriptor2PlayerAbility extends Model<GuideDescriptor2PlayerAbility> {

    @ForeignKey(() => GuideDescriptor)
    guideDescriptorId: number

    @ForeignKey(() => Ability)
    abilityId: number

}
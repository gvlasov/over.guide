import {
    AllowNull,
    Column,
    ForeignKey,
    Model,
    Table,
} from 'sequelize-typescript';
import {GuideDescriptor} from "src/database/models/GuideDescriptor";
import {Ability} from "src/database/models/Ability";

@Table({
    name: {
        singular: 'GuideDescriptor2TeammateAbility',
        plural: 'GuideDescriptor2TeammateAbilities',
    },
    createdAt: false,
    updatedAt: false,
})
export class GuideDescriptor2TeammateAbility extends Model<GuideDescriptor2TeammateAbility> {

    @AllowNull(false)
    @Column
    @ForeignKey(() => GuideDescriptor)
    guideDescriptorId: number

    @AllowNull(false)
    @Column
    @ForeignKey(() => Ability)
    abilityId: number

}
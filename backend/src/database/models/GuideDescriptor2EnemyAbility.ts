import {ForeignKey, Model, Table,} from 'sequelize-typescript';
import {GuideDescriptor} from "src/database/models/GuideDescriptor";
import {Ability} from "src/database/models/Ability";

@Table({
    name: {
        singular: 'GuideDescriptor2EnemyAbility',
        plural: 'GuideDescriptor2EnemyAbilities',
    },
    createdAt: false,
    updatedAt: false,
})
export class GuideDescriptor2EnemyAbility extends Model<GuideDescriptor2EnemyAbility> {

    @ForeignKey(() => GuideDescriptor)
    guideDescriptorId: number

    @ForeignKey(() => Ability)
    abilityId: number

}
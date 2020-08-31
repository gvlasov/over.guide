import {
    AllowNull,
    Column,
    ForeignKey,
    Model,
    Table,
} from 'sequelize-typescript';
import {DataTypes} from "sequelize";
import {Guide} from "src/database/models/Guide";
import {User} from "src/database/models/User";

@Table({
    name: {
        singular: 'User2BookmarkedGuide',
        plural: 'User2BookmarkedGuides',
    },
    createdAt: false,
    updatedAt: false,
})
export class User2TrainingGoal extends Model<User2TrainingGoal> {

    @AllowNull(false)
    @Column
    @ForeignKey(() => User)
    userId: number

    @AllowNull(false)
    @Column
    @ForeignKey(() => Guide)
    guideId: number

    @AllowNull(false)
    @Column({type: new DataTypes.INTEGER({unsigned: true})})
    order: number

}
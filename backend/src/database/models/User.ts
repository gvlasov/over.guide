import {
    AllowNull,
    BelongsToMany,
    Column,
    Model,
    Table,
    Unique
} from 'sequelize-typescript';
import {DataTypes} from "sequelize";
import {Guide} from "src/database/models/Guide";
import {User2TrainingGoal} from "src/database/models/User2TrainingGoal";
import UserDto from "data/dto/UserDto";
import {GuideHead} from "src/database/models/GuideHead";

@Table({
    name: {
        singular: 'User',
        plural: 'Users',
    }
})
export class User extends Model<User> {

    @AllowNull(false)
    @Unique
    @Column({type: new DataTypes.STRING(20)})
    name: string;

    @Unique
    @AllowNull(false)
    @Column({type: new DataTypes.STRING(15)})
    battleNetUserId: string

    @BelongsToMany(
        () => Guide,
        {

            through: {
                model: () => User2TrainingGoal,
            },
        }
    )
    trainingGoals: Array<Guide & { User2TrainingGoal: User2TrainingGoal }>;

    @AllowNull(false)
    @Column({type: new DataTypes.TINYINT()})
    banned: boolean;

    @BelongsToMany(
        () => GuideHead,
        {

            through: {
                model: () => User2TrainingGoal,
            },
            foreignKey: 'userId',
            otherKey: 'guideId',
            targetKey: 'guideId',
            sourceKey: 'id',
            constraints: false,
        }
    )
    trainingGoalsHeads: Array<GuideHead & { User2TrainingGoal: User2TrainingGoal }>;

    toDto(): UserDto {
        return {
            id: this.id,
            name: this.name
        } as UserDto;
    }

}
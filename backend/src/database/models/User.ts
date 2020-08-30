import {
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

@Table({
    name: {
        singular: 'User',
        plural: 'Users',
    }
})
export class User extends Model<User> {

    @Column({type: new DataTypes.STRING(20)})
    name: string;

    @Unique
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

    toDto(): UserDto {
        return {
            id: this.id,
            name: this.name
        } as UserDto;
    }

}
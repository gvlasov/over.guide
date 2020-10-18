import {
    AllowNull,
    BelongsToMany,
    Column,
    HasMany,
    Model,
    Table,
    Unique
} from 'sequelize-typescript';
import Sequelize, {DataTypes} from "sequelize";
import {Guide} from "src/database/models/Guide";
import {User2TrainingGoal} from "src/database/models/User2TrainingGoal";
import UserDto from "data/dto/UserDto";
import {GuideHead} from "src/database/models/GuideHead";
import {Vote} from "src/database/models/Vote";

@Table({
    name: {
        singular: 'User',
        plural: 'Users',
    },
    scopes: {
        withVotesCount: () => {
            return {
                attributes: {
                    include: [
                        [

                            Sequelize.fn('count', Sequelize.col('authoredGuides.votes.id')),
                            'guideVotesReceivedCount',
                        ],
                    ]
                },
                include: [{
                    model: Guide,
                    as: 'authoredGuides',
                    include: [
                        {
                            model: Vote,
                            as: 'votes',
                            attributes: []
                        }
                    ],
                    attributes: [],
                }],
                group: ['User.id'],
            }
        }
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

    @Column({
        type: new DataTypes.VIRTUAL(DataTypes.INTEGER)
    })
    guideVotesReceivedCount: number

    @HasMany(
        () => Guide,
        'authorId'
    )
    authoredGuides: Guide[]

    toDto(): UserDto {
        return {
            id: this.id,
            name: this.name
        } as UserDto;
    }

}
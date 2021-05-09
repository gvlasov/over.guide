import {
    AllowNull,
    BelongsToMany,
    Column,
    HasMany,
    Model,
    Table,
    Unique
} from 'sequelize-typescript';
import Sequelize, {DataTypes, Op} from "sequelize";
import {Guide} from "src/database/models/Guide";
import {User2TrainingGoal} from "src/database/models/User2TrainingGoal";
import UserDto from "data/dto/UserDto";
import {GuideHead} from "src/database/models/GuideHead";
import {Vote} from "src/database/models/Vote";
import {Restriction} from "src/database/models/Restriction";
import {Sentence} from "src/database/models/Sentence";

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
        },
        activeRestrictions: () => {
            return {
                include: [
                    {
                        model: Sentence,
                        as: 'sentences',
                        include: [
                            {
                                model: Restriction,
                                as: 'restrictions',
                                where: {
                                    end: {
                                        [Op.gt]: new Date().toISOString(),
                                    },
                                },
                            },
                        ],
                    }
                ],
                group: ['User.id', 'sentences.id'],
            }
        },
    }
})
export class User extends Model<User> {

    @AllowNull(false)
    @Unique({name: 'name', msg: ''})
    @Column({type: new DataTypes.STRING(20)})
    name: string;

    @Unique({name: 'battleNetUserId', msg: ''})
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

    @HasMany(() => Sentence, 'defenderId')
    sentences: Sentence[]

    toDto(): UserDto {
        return {
            id: this.id,
            name: this.name
        } as UserDto;
    }

}
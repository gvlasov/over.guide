import {
    AllowNull,
    AutoIncrement,
    BelongsTo,
    Column,
    ForeignKey,
    Model,
    PrimaryKey,
    Table
} from 'sequelize-typescript';
import {DataTypes} from "sequelize";
import {User} from "src/database/models/User";
import {Guide} from "src/database/models/Guide";

@Table
export class GuideVote extends Model<GuideVote> {

    @PrimaryKey
    @AutoIncrement
    @Column
    public id: number

    @AllowNull(false)
    @ForeignKey(() => Guide)
    @Column({type: new DataTypes.INTEGER()})
    guideId: number

    @BelongsTo(() => Guide, 'guideId')
    guide: Guide

    @AllowNull(false)
    @ForeignKey(() => User)
    @Column
    upvoterId: number

    @BelongsTo(() => User, 'upvoterId')
    upvoter: User

}
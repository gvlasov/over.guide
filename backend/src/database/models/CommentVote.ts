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
import {Comment} from "src/database/models/Comment";
import {User} from "src/database/models/User";

@Table
export class CommentVote extends Model<CommentVote> {

    @PrimaryKey
    @AutoIncrement
    @Column
    public id: number

    @AllowNull(false)
    @ForeignKey(() => Comment)
    @Column({type: new DataTypes.INTEGER()})
    commentId: number

    @BelongsTo(() => Comment, 'commentId')
    comment: Comment

    @AllowNull(false)
    @ForeignKey(() => User)
    @Column
    upvoterId: number

    @BelongsTo(() => User, 'upvoterId')
    upvoter: User

    @AllowNull(false)
    @Column({type: new DataTypes.DATE()})
    createdAt: Date

}
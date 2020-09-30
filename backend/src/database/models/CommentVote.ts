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

@Table({
    createdAt: false,
    updatedAt: false,
})
export class CommentVote extends Model<CommentVote> {

    @PrimaryKey
    @AutoIncrement
    @Column
    public id: number

    private static readonly uniqueKeyName = 'comment_vote_unique';

    @AllowNull(false)
    @ForeignKey(() => Comment)
    @Column({
        type: new DataTypes.INTEGER(),
        unique: CommentVote.uniqueKeyName,
    })
    commentId: number

    @BelongsTo(() => Comment, 'commentId')
    comment: Comment

    @AllowNull(false)
    @ForeignKey(() => User)
    @Column({
        unique: CommentVote.uniqueKeyName,
    })
    upvoterId: number

    @BelongsTo(() => User, 'upvoterId')
    upvoter: User

}
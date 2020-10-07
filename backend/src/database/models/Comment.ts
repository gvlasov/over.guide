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
import PostTypeId from "data/PostTypeId";
import {User} from "src/database/models/User";
import CommentReadDto from "data/dto/CommentReadDto";

@Table({
    createdAt: true,
    updatedAt: true,
    deletedAt: 'deactivatedAt',
})
export class Comment extends Model<Comment> {

    @PrimaryKey
    @AutoIncrement
    @Column
    public id: number

    @AllowNull(true)
    @ForeignKey(() => Comment)
    @Column({type: new DataTypes.INTEGER()})
    parentId: number | null

    @BelongsTo(() => Comment)
    parent: Comment | null

    @AllowNull(false)
    @Column({type: new DataTypes.INTEGER()})
    postId: number

    @AllowNull(false)
    @Column({type: new DataTypes.INTEGER()})
    postType: PostTypeId

    @AllowNull(false)
    @Column({type: new DataTypes.TEXT()})
    content: string

    @AllowNull(false)
    @ForeignKey(() => User)
    @Column
    authorId: number

    @BelongsTo(() => User, 'authorId')
    author: User

    @AllowNull(false)
    @Column({type: new DataTypes.DATE()})
    createdAt: Date

    @AllowNull(false)
    @Column({type: new DataTypes.DATE()})
    updatedAt: Date

    @AllowNull(true)
    @Column({type: new DataTypes.DATE()})
    deactivatedAt: Date

    @AllowNull(true)
    @ForeignKey(() => User)
    @Column
    deactivatedById: number

    @BelongsTo(() => User, 'deactivatedById')
    deactivatedBy: User

    toDto(votes: number): CommentReadDto {
        return {
            id: this.id,
            author: this.author.toDto(),
            content: this.content,
            createdAt: this.createdAt.toISOString(),
            parentId: this.parentId,
            postId: this.postId,
            postType: this.postType,
            updatedAt: this.updatedAt.toISOString(),
            votes,
        }
    }

}
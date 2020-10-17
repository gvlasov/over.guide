import {
    AllowNull,
    AutoIncrement,
    BelongsTo,
    Column,
    ForeignKey,
    HasMany,
    Model,
    PrimaryKey,
    Table
} from 'sequelize-typescript';
import Sequelize, {DataTypes} from "sequelize";
import PostTypeId from "data/PostTypeId";
import {User} from "src/database/models/User";
import AliveCommentReadDto from "data/dto/AliveCommentReadDto";
import DeletedCommentReadDto from "data/dto/DeletedCommentReadDto";
import {Vote} from "src/database/models/Vote";
import {CommentReadDto} from "data/dto/CommentReadDto";

@Table({
    deletedAt: false,
    defaultScope: {
        include: [
            {
                model: User,
                as: 'author',
            },
        ],
    },
    scopes: {
        votes: (voteIdPath: string = 'votes') => {
            return {
                attributes: {
                    include: [
                        [
                            Sequelize.literal('count(`' + voteIdPath + '`.id)'),
                            'votesCount',
                        ],
                    ]
                },
                include: [
                    {
                        model: Vote,
                        as: 'votes',
                        attributes: [],
                    },
                ],
                group: ['id']
            }
        }
    }
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

    @HasMany(
        () => Vote,
        {
            foreignKey: 'postId',
            constraints: false,
            scope: {
                postTypeId: PostTypeId.Comment,
            }
        }
    )
    votes: Vote[]

    @Column({
        type: new DataTypes.VIRTUAL(DataTypes.INTEGER)
    })
    votesCount: number

    toDto(): CommentReadDto {
        if (this.deactivatedAt !== null) {
            return this.toDeletedDto()
        } else {
            return this.toAliveDto()
        }
    }

    toAliveDto(): AliveCommentReadDto {
        return {
            ...this.toDeletedDto(),
            content: this.content,
            deleted: false,
        }
    }

    toDeletedDto(): DeletedCommentReadDto {
        return {
            id: this.id,
            author: this.author.toDto(),
            createdAt: this.createdAt.toISOString(),
            parentId: this.parentId,
            postId: this.postId,
            postType: this.postType,
            updatedAt: this.updatedAt.toISOString(),
            votesCount: this.votesCount,
            deleted: true,
        }
    }

}
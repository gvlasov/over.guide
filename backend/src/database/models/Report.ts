import {
    AfterFind,
    AllowNull,
    AutoIncrement,
    BelongsTo,
    Column,
    ForeignKey,
    Model,
    PrimaryKey,
    Table
} from 'sequelize-typescript';
import {DataTypes, Op} from "sequelize";
import {User} from "src/database/models/User";
import PostTypeId from "data/PostTypeId";
import ReportReasonId from "data/ReportReasonId";
import ReportReadDto from "data/dto/ReportReadDto";
import {Comment} from "src/database/models/Comment";
import {GuideHead} from "src/database/models/GuideHead";

@Table({
    updatedAt: false,
    scopes: {
        withContent: () => {
            return {
                where: {
                    [Op.or]: [
                        {
                            '$comment.id$': {
                                [Op.ne]: null
                            }
                        },
                        {
                            '$head.guideId$': {
                                [Op.ne]: null
                            }
                        }
                    ]
                },
                include: [
                    {
                        model:
                            Comment.scope(['defaultScope', {method: ['votes', 'comment->votes']}]),
                        as: 'comment',
                        required: false,
                        where: {
                            deactivatedAt: null,
                            deactivatedById: null
                        },
                    },
                    {
                        model: GuideHead,
                        as: 'head',
                        required: false,
                        include: GuideHead.includesForDto(),
                    }
                ],
                group: ['Report.postId', 'Report.postTypeId']
            }
        }
    }
})
export class Report extends Model<Report> {

    @PrimaryKey
    @AutoIncrement
    @Column
    public id: number

    private static readonly uniqueKeyName = 'report_unique';

    @AllowNull(false)
    @Column({
        type: new DataTypes.INTEGER(),
        unique: Report.uniqueKeyName,
    })
    postId: number

    @AllowNull(false)
    @Column({
        type: new DataTypes.INTEGER(),
        unique: Report.uniqueKeyName,
    })
    postTypeId: PostTypeId

    post: Comment | GuideHead

    @BelongsTo(
        () => Comment,
        {
            foreignKey: 'postId',
            constraints: false,
            scope: {
                '$Report.postTypeId$': PostTypeId.Comment,
            },
        }
    )
    comment: Comment

    @BelongsTo(
        () => GuideHead,
        {
            foreignKey: 'postId',
            constraints: false,
            scope: {
                '$Report.postTypeId$': PostTypeId.Guide,
            },
        }
    )
    head: GuideHead

    @AllowNull(false)
    @ForeignKey(() => User)
    @Column({
        unique: Report.uniqueKeyName,
    })
    reporterId: number

    @BelongsTo(() => User, 'reporterId')
    reporter: User

    @AllowNull(false)
    @Column({
        type: new DataTypes.INTEGER(),
    })
    reportReasonId: ReportReasonId

    @AllowNull(false)
    @Column({
        type: new DataTypes.TINYINT({unsigned: true, length: 1}),
    })
    handled: number

    @AfterFind
    static applyPosts(instances: Report | Report[]) {
        if (!Array.isArray(instances)) {
            instances = [instances];
        }
        for (const instance of instances) {
            if (instance.postTypeId === PostTypeId.Comment && instance.comment !== void 0) {
                instance.post = instance.comment;
            } else if (instance.postTypeId === PostTypeId.Guide && instance.head !== void 0) {
                instance.post = instance.head;
            }
            delete instance.comment;
            delete (instance as any).dataValues.comment;
            delete instance.head;
            delete (instance as any).dataValues.head;
        }
    }

    toDto(): ReportReadDto {
        return {
            id: this.id,
            postTypeId: this.postTypeId,
            postId: this.postId,
            reportReasonId: this.reportReasonId,
            createdAt: this.createdAt.toISOString(),
            post: this.post.toDto(),
            reporter: this.reporter.toDto(),
        } as ReportReadDto
    }

}
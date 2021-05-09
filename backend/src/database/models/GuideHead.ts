import {
    BelongsTo,
    Column,
    ForeignKey,
    Model,
    PrimaryKey,
    Table
} from 'sequelize-typescript';
import {DataTypes, Includeable, IncludeOptions} from "sequelize";
import {GuideHistoryEntry} from "src/database/models/GuideHistoryEntry";
import {ActuallyNotTableButView} from "src/services/fixture.service";
import GuideHeadDto from "data/dto/GuideHeadDto";
import {Guide} from "src/database/models/Guide";
import {User} from "src/database/models/User";
import {GuidePartText} from "src/database/models/GuidePartText";
import {GuidePartVideo} from "src/database/models/GuidePartVideo";
import {GuideDescriptor} from "src/database/models/GuideDescriptor";
import {YoutubeVideoExcerpt} from "src/database/models/YoutubeVideoExcerpt";
import {User2TrainingGoal} from "src/database/models/User2TrainingGoal";
import GuideHistoryEntryReadDto from "data/dto/GuideHistoryEntryReadDto";

@Table(
    {
        createdAt: false,
        updatedAt: false,
    },
)
@ActuallyNotTableButView
export class GuideHead extends Model<GuideHead> {

    @PrimaryKey
    @Column
    guideId: number

    @ForeignKey(() => GuideHistoryEntry)
    @Column({type: new DataTypes.INTEGER()})
    guideHistoryEntryId: number

    @BelongsTo(() => GuideHistoryEntry, 'guideHistoryEntryId')
    guideHistoryEntry: GuideHistoryEntry

    @Column({type: new DataTypes.INTEGER()})
    votesCount: number

    @Column({type: new DataTypes.INTEGER()})
    commentsCount: number

    order: number

    @BelongsTo(
        () => User2TrainingGoal,
        {
            foreignKey: 'guideId',
            targetKey: 'guideId'
        }
    )
    user2TrainingGoal: User2TrainingGoal

    toDto(): GuideHeadDto<GuideHistoryEntryReadDto> {
        return {
            guideHistoryEntry: this.guideHistoryEntry.toDto(),
            commentsCount: this.commentsCount,
            votesCount: this.votesCount,
        } as GuideHeadDto<GuideHistoryEntryReadDto>
    }

    static includesForDto(options?: {
        author?: IncludeOptions
        guide?: IncludeOptions
        guideHistoryEntry?: IncludeOptions
        descriptor?: IncludeOptions
        excerpt?: IncludeOptions
        guidePartVideos?: IncludeOptions
    }): Includeable[] {
        return [
            {
                model: GuideHistoryEntry,
                as: 'guideHistoryEntry',
                required: true,
                ...options?.guideHistoryEntry,
                include: [
                    {
                        model: Guide,
                        as: 'guide',
                        where: {
                            deactivatedById: null,
                            deactivatedAt: null,
                        },
                        ...options?.guide,
                        include: [{
                            model: User,
                            as: 'author',
                            ...options?.author,
                        }]
                    },
                    {
                        model: GuidePartText, as: 'guidePartTexts',
                        include: [{all: true}],
                    },
                    {
                        model: GuidePartVideo, as: 'guidePartVideos',
                        include: [{
                            model: YoutubeVideoExcerpt,
                            as: 'excerpt',
                            ...options?.excerpt
                        }],
                        ...options?.guidePartVideos
                    },
                    {
                        model: GuideDescriptor,
                        as: 'descriptor',
                        include: [{all: true}],
                        ...options?.descriptor,
                    },
                ]
            },
        ]
    }

}
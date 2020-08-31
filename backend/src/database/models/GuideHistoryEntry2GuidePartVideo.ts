import {
    AllowNull,
    BelongsTo,
    Column,
    ForeignKey,
    Model,
    Table,
} from 'sequelize-typescript';
import {GuideHistoryEntry} from "src/database/models/GuideHistoryEntry";
import {GuidePartVideo} from "src/database/models/GuidePartVideo";
import {DataTypes} from "sequelize";

@Table({
    name: {
        singular: 'GuideHistoryEntry2GuidePartVideo',
        plural: 'GuideHistoryEntry2GuidePartVideos',
    },
    createdAt: false,
    updatedAt: false,
})
export class GuideHistoryEntry2GuidePartVideo extends Model<GuideHistoryEntry2GuidePartVideo> {

    @AllowNull(false)
    @Column
    @ForeignKey(() => GuideHistoryEntry)
    guideHistoryEntryId: number

    @AllowNull(false)
    @Column
    @ForeignKey(() => GuidePartVideo)
    guidePartVideoId: number

    @BelongsTo(() => GuideHistoryEntry, 'guideHistoryEntryId')
    guideHistoryEntry: GuideHistoryEntry

    @BelongsTo(() => GuidePartVideo, 'guidePartVideoId')
    guidePartVideo: GuidePartVideo

    @AllowNull(false)
    @Column({type: new DataTypes.INTEGER})
    order: number

}
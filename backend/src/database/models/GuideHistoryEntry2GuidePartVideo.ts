import {Column, ForeignKey, Model, Table,} from 'sequelize-typescript';
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

    @ForeignKey(() => GuideHistoryEntry)
    guideHistoryEntryId: number

    @ForeignKey(() => GuidePartVideo)
    guidePartVideoId: number

    @Column({type: new DataTypes.INTEGER})
    order: number

}
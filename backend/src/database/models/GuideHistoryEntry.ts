import {
    AutoIncrement,
    BelongsTo,
    BelongsToMany,
    Column,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
    UpdatedAt
} from 'sequelize-typescript';
import {Hero} from "src/database/models/Hero";
import {User} from "src/database/models/User";
import {Guide} from "src/database/models/Guide";
import {GuideHistoryEntry2GuidePartText} from "src/database/models/GuideHistoryEntry2GuidePartText";
import {GuidePartText} from "src/database/models/GuidePartText";
import {GuidePartVideo} from "src/database/models/GuidePartVideo";
import {GuideHistoryEntry2GuidePartVideo} from "src/database/models/GuideHistoryEntry2GuidePartVideo";
import {DataTypes} from "sequelize";
import {GuideDescriptor} from "src/database/models/GuideDescriptor";

@Table({
    name: {
        singular: 'GuideHistoryEntry',
        plural: 'GuideHistoryEntries',
    },
    createdAt: false,
})
export class GuideHistoryEntry extends Model<GuideHistoryEntry> {

    @PrimaryKey
    @AutoIncrement
    @Column
    public id: number

    @ForeignKey(() => Guide)
    @Column
    guideId: number;

    @BelongsTo(() => Guide, 'guideId')
    guide: Guide

    @ForeignKey(() => User)
    @Column
    updaterId: number;

    @BelongsTo(() => User, 'updaterId')
    updater: Hero

    @ForeignKey(() => GuideDescriptor)
    @Column
    descriptorId: number;

    @BelongsTo(() => GuideDescriptor, 'descriptorId')
    descriptor: GuideDescriptor

    @UpdatedAt
    @Column({type: new DataTypes.DATE(6)})
    updatedOn: Date

    @BelongsToMany(
        () => GuidePartText,
        {

            through: {
                model: () => GuideHistoryEntry2GuidePartText,
            }
        }
    )
    guidePartTexts: Array<GuidePartText & { pivot: GuideHistoryEntry2GuidePartText }>

    @BelongsToMany(
        () => GuidePartVideo,
        {
            through: {
                model: () => GuideHistoryEntry2GuidePartVideo,
            }
        }
    )
    guidePartVideos: Array<GuidePartVideo & { pivot: GuideHistoryEntry2GuidePartVideo }>

    @Column({type: new DataTypes.CHAR(32)})
    contentHash: string;
}

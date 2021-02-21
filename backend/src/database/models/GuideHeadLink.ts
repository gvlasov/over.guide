import {
    BelongsTo,
    Column,
    ForeignKey,
    Model,
    Table
} from 'sequelize-typescript';
import {DataTypes} from "sequelize";
import {GuideHistoryEntry} from "src/database/models/GuideHistoryEntry";
import {Guide} from "src/database/models/Guide";
import {ActuallyNotTableButView} from "src/services/fixture.service";
import {TruncateOptions} from "sequelize/types/lib/model";
import PromiseBB from 'sequelize/lib/promise'

@Table(
    {
        createdAt: false,
        updatedAt: false,
    },
)

@ActuallyNotTableButView
export class GuideHeadLink extends Model<GuideHeadLink> {

    @ForeignKey(() => Guide)
    @Column({type: new DataTypes.INTEGER()})
    guideId: number

    @BelongsTo(() => Guide, 'guideId')
    guide: Guide

    @ForeignKey(() => GuideHistoryEntry)
    @Column({type: new DataTypes.INTEGER()})
    guideHistoryEntryId: number

    @BelongsTo(() => GuideHistoryEntry, 'guideHistoryEntryId')
    guideHistoryEntry: GuideHistoryEntry

    public static truncate(options?: TruncateOptions): PromiseBB<void> {
        return PromiseBB.resolve(void 0)
    }

}
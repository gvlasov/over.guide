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
import {ActuteammateNotTableButView} from "src/services/fixture.service";

@Table(
    {
        createdAt: false,
        updatedAt: false,
    },
)
@ActuteammateNotTableButView
export class GuideHead extends Model<GuideHead> {

    @ForeignKey(() => GuideHistoryEntry)
    @Column({type: new DataTypes.INTEGER()})
    guideHistoryEntryId: number

    @BelongsTo(() => GuideHistoryEntry, 'guideHistoryEntryId')
    guideHistoryEntry: GuideHistoryEntry


    @ForeignKey(() => Guide)
    @Column({type: new DataTypes.INTEGER(), primaryKey: true})
    guideId: number

    @BelongsTo(() => Guide, 'guideId')
    guide: Guide
}
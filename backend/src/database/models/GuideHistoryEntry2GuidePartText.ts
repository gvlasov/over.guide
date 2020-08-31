import {
    AllowNull,
    BelongsTo,
    Column,
    ForeignKey,
    Model,
    Table,
} from 'sequelize-typescript';
import {GuideHistoryEntry} from "src/database/models/GuideHistoryEntry";
import {GuidePartText} from "src/database/models/GuidePartText";
import {DataTypes} from "sequelize";

@Table({
    name: {
        singular: 'GuideHistoryEntry2GuidePartText',
        plural: 'GuideHistoryEntry2GuidePartTexts',
    },
    createdAt: false,
    updatedAt: false,
})
export class GuideHistoryEntry2GuidePartText extends Model<GuideHistoryEntry2GuidePartText> {

    @AllowNull(false)
    @Column
    @ForeignKey(() => GuideHistoryEntry)
    guideHistoryEntryId: number

    @AllowNull(false)
    @Column
    @ForeignKey(() => GuidePartText)
    guidePartTextId: number

    @BelongsTo(() => GuideHistoryEntry, 'guideHistoryEntryId')
    guideHistoryEntry: GuideHistoryEntry

    @BelongsTo(() => GuidePartText, 'guidePartTextId')
    guidePartText: GuidePartText

    @AllowNull(false)
    @Column({type: new DataTypes.INTEGER()})
    order: number

}
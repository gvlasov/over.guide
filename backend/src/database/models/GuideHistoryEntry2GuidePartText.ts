import {Column, ForeignKey, HasOne, Model, Table,} from 'sequelize-typescript';
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

    @ForeignKey(() => GuideHistoryEntry)
    guideHistoryEntryId: number

    @ForeignKey(() => GuidePartText)
    guidePartTextId: number

    @HasOne(() => GuideHistoryEntry, 'guideHistoryEntryId')
    guideHistoryEntry: GuideHistoryEntry

    @HasOne(() => GuidePartText, 'guidePartTextId')
    guidePartText: GuidePartText

    @Column({type: new DataTypes.INTEGER()})
    order: number

}
import {ForeignKey, Model, Table,} from 'sequelize-typescript';
import {GuideHistoryEntry} from "src/database/models/GuideHistoryEntry";
import {GuidePartText} from "src/database/models/GuidePartText";

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

    order: number

}
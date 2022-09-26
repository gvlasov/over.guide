import { Model } from 'sequelize-typescript';
import { GuideHistoryEntry } from "src/database/models/GuideHistoryEntry";
import { GuidePartText } from "src/database/models/GuidePartText";
export declare class GuideHistoryEntry2GuidePartText extends Model<GuideHistoryEntry2GuidePartText> {
    guideHistoryEntryId: number;
    guidePartTextId: number;
    guideHistoryEntry: GuideHistoryEntry;
    guidePartText: GuidePartText;
    order: number;
}

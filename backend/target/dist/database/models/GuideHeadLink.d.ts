import { Model } from 'sequelize-typescript';
import { GuideHistoryEntry } from "src/database/models/GuideHistoryEntry";
import { Guide } from "src/database/models/Guide";
export declare class GuideHeadLink extends Model<GuideHeadLink> {
    guideId: number;
    guide: Guide;
    guideHistoryEntryId: number;
    guideHistoryEntry: GuideHistoryEntry;
}

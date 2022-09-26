import { Model } from 'sequelize-typescript';
import { GuideHistoryEntry } from "src/database/models/GuideHistoryEntry";
import { GuidePartVideo } from "src/database/models/GuidePartVideo";
export declare class GuideHistoryEntry2GuidePartVideo extends Model<GuideHistoryEntry2GuidePartVideo> {
    guideHistoryEntryId: number;
    guidePartVideoId: number;
    guideHistoryEntry: GuideHistoryEntry;
    guidePartVideo: GuidePartVideo;
    order: number;
}

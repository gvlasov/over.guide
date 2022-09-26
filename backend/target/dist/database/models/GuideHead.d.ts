import { Model } from 'sequelize-typescript';
import { Includeable, IncludeOptions } from "sequelize";
import { GuideHistoryEntry } from "src/database/models/GuideHistoryEntry";
import GuideHeadDto from "data/dto/GuideHeadDto";
import { User2TrainingGoal } from "src/database/models/User2TrainingGoal";
import GuideHistoryEntryReadDto from "data/dto/GuideHistoryEntryReadDto";
export declare class GuideHead extends Model<GuideHead> {
    guideId: number;
    guideHistoryEntryId: number;
    guideHistoryEntry: GuideHistoryEntry;
    votesCount: number;
    commentsCount: number;
    order: number;
    user2TrainingGoal: User2TrainingGoal;
    toDto(): GuideHeadDto<GuideHistoryEntryReadDto>;
    static includesForDto(options?: {
        author?: IncludeOptions;
        guide?: IncludeOptions;
        guideHistoryEntry?: IncludeOptions;
        descriptor?: IncludeOptions;
        excerpt?: IncludeOptions;
        guidePartVideos?: IncludeOptions;
    }): Includeable[];
}

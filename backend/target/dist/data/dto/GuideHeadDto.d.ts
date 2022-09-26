import GuideHistoryEntryDto from "data/dto/GuideHistoryEntryDto";
import GuideHistoryEntryReadDto from "data/dto/GuideHistoryEntryReadDto";
import GuideHistoryEntryCreateDto from "data/dto/GuideHistoryEntryCreateDto";
export default interface GuideHeadDto<D extends GuideHistoryEntryDto> {
    guideHistoryEntry: D;
    commentsCount: number;
    votesCount: number;
}
export declare type ExistingGuideHeadDto = GuideHeadDto<GuideHistoryEntryReadDto>;
export declare type NewGuideHeadDto = GuideHeadDto<GuideHistoryEntryCreateDto>;

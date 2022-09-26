import GuideHistoryEntryReadDto from "data/dto/GuideHistoryEntryReadDto";
export default interface TrainingGoalDto {
    readonly guide: GuideHistoryEntryReadDto;
    readonly order: number;
}

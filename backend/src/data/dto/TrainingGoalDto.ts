import GuideHistoryEntryDto from "data/dto/GuideHistoryEntryDto";

export default interface TrainingGoalDto {
    readonly guide: GuideHistoryEntryDto
    readonly order: number
}

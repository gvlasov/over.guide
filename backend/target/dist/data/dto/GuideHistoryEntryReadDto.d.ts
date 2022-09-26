import GuideHistoryEntryDto from "data/dto/GuideHistoryEntryDto";
import GuideDto from "data/dto/GuideDto";
export default interface GuideHistoryEntryReadDto extends GuideHistoryEntryDto {
    guide: GuideDto;
    updatedAt: string;
}

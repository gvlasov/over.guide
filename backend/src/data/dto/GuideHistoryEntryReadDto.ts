import GuideHistoryEntryDto from "data/dto/GuideHistoryEntryDto";
import GuideDto from "data/dto/GuideDto";

export default interface GuideHistoryEntryReadDto extends GuideHistoryEntryDto {
    guide: GuideDto
    updatedAt: string
}

export function isExisting(dto: GuideHistoryEntryDto): dto is GuideHistoryEntryReadDto {
    const anyDto = dto as any;
    return anyDto.guideId !== void 0
        && anyDto.updatedAt !== void 0
}

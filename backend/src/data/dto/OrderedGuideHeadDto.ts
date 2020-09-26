import GuideHistoryEntryReadDto from "data/dto/GuideHistoryEntryReadDto";
import GuideHeadDto from 'data/dto/GuideHeadDto'

export default interface OrderedGuideHeadDto extends GuideHeadDto<GuideHistoryEntryReadDto> {
    order: number
}

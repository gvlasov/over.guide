import GuideDescriptorDto from "data/dto/GuideDescriptorDto";
import {GuidePartAnyDto} from "data/dto/GuidePartDto";

export default interface GuideHistoryEntryDto {
    id?: number,
    guideId?: number,
    descriptor: GuideDescriptorDto,
    parts: GuidePartAnyDto[]
}

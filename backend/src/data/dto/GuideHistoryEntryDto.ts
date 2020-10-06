import GuideDescriptorDto from "data/dto/GuideDescriptorDto";
import {GuidePartAnyDto} from "data/dto/GuidePartDto";

export default interface GuideHistoryEntryDto {
    descriptor: GuideDescriptorDto,
    parts: GuidePartAnyDto[]
    isPublic: boolean
}

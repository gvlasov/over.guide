import GuideDescriptorDto from "data/dto/GuideDescriptorDto";
import {GuidePartAnyDto} from "data/dto/GuidePartDto";
import UserDto from "data/dto/UserDto";

export default interface GuideHistoryEntryDto {
    id?: number,
    author?: UserDto,
    guideId?: number,
    createdAt?: string,
    descriptor: GuideDescriptorDto,
    parts: GuidePartAnyDto[]
}

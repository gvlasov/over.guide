import UserDto from "data/dto/UserDto";
import GuideSearchPageDto from "data/dto/GuideSearchPageDto";

export default interface UserInfoDto {
    readonly user: UserDto;
    readonly lastAuthoredGuides: GuideSearchPageDto
    readonly guideVotesReceivedCount: number
}

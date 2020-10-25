import UserInfoDto from "data/dto/UserInfoDto";
import UserVso from "@/ts/vso/UserVso";
import RestrictionReadDto from "data/dto/RestrictionReadDto";
import PrivateUserInfoDto from "data/dto/PrivateUserInfoDto";
import GuideAuthorSearchFeedVso from "@/ts/vso/GuideAuthorSearchFeedVso";

export default class UserInfoVso {

    readonly user: UserVso;
    readonly lastAuthoredGuidesFeed: GuideAuthorSearchFeedVso
    readonly guideVotesReceivedCount: number
    readonly restrictions?: RestrictionReadDto[]

    constructor(dto: UserInfoDto | PrivateUserInfoDto) {
        this.user = new UserVso(dto.user);
        this.lastAuthoredGuidesFeed = new GuideAuthorSearchFeedVso(this.user)
        this.lastAuthoredGuidesFeed.loadPage(
            dto.lastAuthoredGuides
        )
        this.guideVotesReceivedCount = dto.guideVotesReceivedCount
        if ("restrictions" in dto && dto.restrictions !== void 0) {
            this.restrictions = dto.restrictions;
        }
    }

}

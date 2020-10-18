import UserInfoDto from "data/dto/UserInfoDto";
import UserVso from "@/ts/vso/UserVso";
import ExistingGuideHeadVso from "@/ts/vso/ExistingGuideHeadVso";

export default class UserInfoVso {

    readonly user: UserVso;
    readonly lastAuthoredGuides: ExistingGuideHeadVso[];
    readonly guideVotesReceivedCount: number

    constructor(dto: UserInfoDto) {
        this.user = new UserVso(dto.user);
        this.lastAuthoredGuides = dto.lastAuthoredGuides.guides
            .map(g => new ExistingGuideHeadVso(g))
        this.guideVotesReceivedCount = dto.guideVotesReceivedCount
    }

}

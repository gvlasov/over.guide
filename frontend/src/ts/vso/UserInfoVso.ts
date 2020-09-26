import UserInfoDto from "data/dto/UserInfoDto";
import UserVso from "@/ts/vso/UserVso";
import ExistingGuideHistoryEntryVso
    from "@/ts/vso/ExistingGuideHistoryEntryVso";

export default class UserInfoVso {

    readonly user: UserVso;
    private readonly lastAuthoredGuides: ExistingGuideHistoryEntryVso[];

    constructor(dto: UserInfoDto) {
        this.user = new UserVso(dto.user);
        this.lastAuthoredGuides = dto.lastAuthoredGuides.guides.map(g => new ExistingGuideHistoryEntryVso(g))
    }

}

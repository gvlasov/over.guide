import UserInfoDto from "data/dto/UserInfoDto";
import UserVso from "@/ts/vso/UserVso";
import GuideVso from "@/ts/vso/GuideVso";

export default class UserInfoVso {

    readonly user: UserVso;
    private readonly lastAuthoredGuides: GuideVso[];

    constructor(dto: UserInfoDto) {
        this.user = new UserVso(dto.user);
        this.lastAuthoredGuides = dto.lastAuthoredGuides.guides.map(g => new GuideVso(g))
    }

}

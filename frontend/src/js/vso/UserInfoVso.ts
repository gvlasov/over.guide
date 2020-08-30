import UserInfoDto from "data/dto/UserInfoDto";
import UserVso from "@/js/vso/UserVso";
import GuideVso from "@/js/vso/GuideVso";

export default class UserInfoVso {

    private readonly user: UserVso;
    private readonly lastAuthoredGuides: GuideVso[];

    constructor(dto: UserInfoDto) {
        this.user = new UserVso(dto.user);
        this.lastAuthoredGuides = dto.lastAuthoredGuides.guides.map(g => new GuideVso(g))
    }

}

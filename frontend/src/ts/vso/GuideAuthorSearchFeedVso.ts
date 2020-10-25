import ExistingGuideHeadVso from "@/ts/vso/ExistingGuideHeadVso";
import FeedVso from "@/ts/vso/FeedVso";
import {ExistingGuideHeadDto} from "data/dto/GuideHeadDto";
import GuideSearchPageDto from "data/dto/GuideSearchPageDto";
import Backend from "@/ts/Backend";
import UserVso from "@/ts/vso/UserVso";

export default class GuideAuthorSearchFeedVso extends FeedVso<ExistingGuideHeadDto, ExistingGuideHeadVso, GuideSearchPageDto> {

    readonly author: UserVso

    constructor(author: UserVso) {
        super()
        this.author = author
    }

    dto2Vso(dto: ExistingGuideHeadDto): ExistingGuideHeadVso {
        return new ExistingGuideHeadVso(dto)
    }

    vsoId(vso: ExistingGuideHeadVso): number {
        return vso.entry.guideId
    }

    get feed(): (ids: number[]) => Promise<GuideSearchPageDto> {
        return (ids: number[]) => {
            return Backend.instance.searchGuidesByAuthorPaginated({
                authorId: this.author.id,
                clientAlreadyHasGuideIds: ids
            })
        }
    }

}

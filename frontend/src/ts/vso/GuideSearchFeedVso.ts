import ExistingGuideHeadVso from "@/ts/vso/ExistingGuideHeadVso";
import FeedVso from "@/ts/vso/FeedVso";
import {ExistingGuideHeadDto} from "data/dto/GuideHeadDto";
import GuideSearchPageDto from "data/dto/GuideSearchPageDto";
import Backend from "@/ts/Backend";
import GuideDescriptorVso from "@/ts/vso/GuideDescriptorVso";

export default class GuideSearchFeedVso extends FeedVso<ExistingGuideHeadDto, ExistingGuideHeadVso, GuideSearchPageDto> {

    readonly descriptor: GuideDescriptorVso
    readonly exact: boolean

    constructor(descriptor: GuideDescriptorVso, exact: boolean) {
        super()
        this.descriptor = descriptor
        this.exact = exact
    }

    dto2Vso(dto: ExistingGuideHeadDto): ExistingGuideHeadVso {
        return new ExistingGuideHeadVso(dto)
    }

    vsoId(vso: ExistingGuideHeadVso): number {
        return vso.entry.guideId
    }

    get feed(): (ids: number[]) => Promise<GuideSearchPageDto> {
        return (ids: number[]) => {
            return Backend.instance.searchGuidesPaginated({
                playerHeroes: this.descriptor.players.heroes.map(it => it.id),
                teammateHeroes: this.descriptor.teammates.heroes.map(it => it.id),
                enemyHeroes: this.descriptor.enemies.heroes.map(it => it.id),
                playerAbilities: this.descriptor.players.abilities.map(it => it.id),
                teammateAbilities: this.descriptor.teammates.abilities.map(it => it.id),
                enemyAbilities: this.descriptor.enemies.abilities.map(it => it.id),
                mapTags: this.descriptor.maps.map(it => it.id),
                thematicTags: this.descriptor.thematicTags.map(it => it.id),
                clientAlreadyHasGuideIds: ids,
                pageNumber: 0,
                exact: this.exact,
            })
        }
    }

}

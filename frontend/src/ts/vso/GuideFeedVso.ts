import ExistingGuideHeadVso from "@/ts/vso/ExistingGuideHeadVso";
import GuideSearchPageDto from "data/dto/GuideSearchPageDto";
import {InfiniteHandlerState} from "@/ts/InfiniteHandlerState";

export default class GuideFeedVso {

    readonly guides: ExistingGuideHeadVso[] = []
    hasNextPage: boolean
    readonly alreadyLoadedGuideIds: number[] = []

    constructor(initial: GuideSearchPageDto) {
        this.hasNextPage = initial.hasNextPage
        this.loadMore(
            initial.guides.map(g => new ExistingGuideHeadVso(g))
        )
    }

    loadMore(heads: ExistingGuideHeadVso[]) {
        this.guides.push(...heads);
        this.alreadyLoadedGuideIds.push(...heads.map(h => h.entry.guideId))
    }

    get isEmpty(): boolean {
        return this.guides.length === 0
    }

    loadPage(page: GuideSearchPageDto, state: InfiniteHandlerState) {
        this.loadMore(
            page.guides.map(dto => new ExistingGuideHeadVso(dto))
        );
        if (!this.isEmpty) {
            state.loaded()
        }
        if (!page.hasNextPage) {
            state.complete()
        }
        this.hasNextPage = page.hasNextPage
    }

    removeElementById(id: number) {
        let index = this.alreadyLoadedGuideIds.indexOf(id);
        if (index === void 0) {
            throw new Error()
        }
        this.alreadyLoadedGuideIds.splice(index, 1)
        index = this.guides.findIndex(g => g.entry.guideId === id)
        if (index === void 0) {
            throw new Error()
        }
        this.guides.splice(index, 1)
    }
}

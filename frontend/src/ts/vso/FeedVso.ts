import {InfiniteHandlerState} from "@/ts/InfiniteHandlerState";
import FeedPortionDto from "data/dto/FeedPortionDto";

export default abstract class FeedVso<Dto, Vso, Page extends FeedPortionDto<Dto>> {

    readonly items: Vso[] = []
    hasNextPage: boolean = true
    readonly alreadyLoadedIds: number[] = []
    lastPage?: Page
    touched: boolean = false

    abstract dto2Vso(dto: Dto): Vso

    abstract vsoId(vso: Vso): number

    abstract get feed(): (ids: number[]) => Promise<Page>;

    protected loadItems(items: Vso[]) {
        this.touched = true
        this.items.push(...items);
        this.alreadyLoadedIds.push(...items.map(h => this.vsoId(h)))
    }

    get isEmpty(): boolean {
        return this.items.length === 0
    }

    loadPage(
        page: Page,
        state: InfiniteHandlerState = this.mockState
    ): void {
        this.loadItems(
            page.items.map(dto => this.dto2Vso(dto))
        );
        if (!this.isEmpty) {
            state.loaded()
        }
        if (!page.hasNextPage) {
            state.complete()
        }
        this.hasNextPage = page.hasNextPage
        this.lastPage = page
    }

    loadNextPage(state: InfiniteHandlerState = this.mockState): Promise<void> {
        return this.feed(this.alreadyLoadedIds)
            .then(page => this.loadPage(page, state))
    }

    removeElementById(id: number) {
        let index = this.alreadyLoadedIds.indexOf(id);
        if (index === void 0) {
            throw new Error()
        }
        this.alreadyLoadedIds.splice(index, 1)
        index = this.items.findIndex(g => this.vsoId(g) === id)
        if (index === void 0) {
            throw new Error()
        }
        this.items.splice(index, 1)
    }

    get mockState() {
        return {
            complete: () => void 0,
            error: () => void 0,
            loaded: () => void 0,
            reset: () => void 0,
        }
    }

}

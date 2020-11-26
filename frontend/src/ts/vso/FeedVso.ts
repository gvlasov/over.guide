import {InfiniteHandlerState} from "@/ts/InfiniteHandlerState";
import FeedPortionDto from "data/dto/FeedPortionDto";

export default abstract class FeedVso<Dto, Vso, Page extends FeedPortionDto<Dto>> {

    readonly items: Vso[] = []
    hasNextPage: boolean = true
    readonly alreadyLoadedIds: number[] = []
    lastPage?: Page
    touched: boolean = false
    currentPromise: Promise<void> | null = null

    abstract dto2Vso(dto: Dto): Vso

    abstract vsoId(vso: Vso): number

    abstract get feed(): (ids: number[]) => Promise<Page>;

    protected loadItems(items: Vso[]) {
        this.touched = true
        this.items.unshift(...items);
        this.alreadyLoadedIds.push(...items.map(h => this.vsoId(h)))
    }

    get isEmpty(): boolean {
        return this.items.length === 0
    }

    loadPage(page: Page, state: InfiniteHandlerState): void {
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

    get isRequestPending(): boolean {
        return this.currentPromise !== null
    }

    loadNextPage(state: InfiniteHandlerState): Promise<void> {
        const promise = this.feed(this.alreadyLoadedIds)
            .then(page => {
                if (this.currentPromise === promise) {
                    // If has not been aborted by a reset
                    this.loadPage(page, state);
                    this.currentPromise = null
                }
            })
        this.currentPromise = promise
        return promise
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

    static get mockState() {
        return {
            complete: () => void 0,
            error: () => void 0,
            loaded: () => void 0,
            reset: () => void 0,
        }
    }

    reset(state: InfiniteHandlerState) {
        this.lastPage = void 0
        this.hasNextPage = true
        this.items.splice(0, this.items.length)
        this.alreadyLoadedIds.splice(0, this.alreadyLoadedIds.length)
        this.touched = false
        this.currentPromise = null
        state.reset()
    }

}

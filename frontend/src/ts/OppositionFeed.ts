import HeroOpposition from "@/ts/vso/HeroOpposition";

export enum FeedEndState {
    End ,
    ThatWasOnly
}
export default interface OppositionFeed {
    getNext(): HeroOpposition | FeedEndState
}
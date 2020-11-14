import HeroOpposition from "@/ts/vso/HeroOpposition";
import OppositionFeed, {FeedEndState,} from "@/ts/OppositionFeed";

export default class SingleOppositionFeed implements OppositionFeed {

    private returned = false

    constructor(private readonly opposition: HeroOpposition) {
    }

    getNext(): HeroOpposition | FeedEndState {
        if (this.returned) {
            return FeedEndState.ThatWasOnly
        } else {
            this.returned = true
            return this.opposition
        }
    }

}
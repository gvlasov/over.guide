import HeroOpposition from "@/ts/vso/HeroOpposition";
import OppositionFeed, {FeedEndState,} from "@/ts/OppositionFeed";
import MatchupEvaluatorService from "@/ts/MatchupEvaluatorService";

export default class RandomOppositionFeed implements OppositionFeed {
    getNext(): HeroOpposition | FeedEndState {
        return MatchupEvaluatorService.instance.getRandomUnevaluatedOpposition() ?? FeedEndState.End
    }
}
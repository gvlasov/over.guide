import HeroOpposition from "./HeroOpposition";
import MatchupEvaluationUserScore from "data/MatchupEvaluationUserScore";

export default class MatchupEvaluationVso {

    constructor(
        public readonly opposition: HeroOpposition,
        public score: MatchupEvaluationUserScore | null
    ) {
    }

    get isEvaluated(): boolean {
        return this.score !== null &&
            this.score !== MatchupEvaluationUserScore.DontKnow;
    }

}

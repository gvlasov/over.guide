import HeroId from "data/HeroId";
import MatchupEvaluationUserScore from "data/MatchupEvaluationUserScore";

export default interface MatchupEvaluationDto {
    readonly subjectId: HeroId
    readonly objectId: HeroId
    readonly score: MatchupEvaluationUserScore|null
}

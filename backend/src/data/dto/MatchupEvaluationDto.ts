import HeroId from "data/HeroId";

export default interface MatchupEvaluationDto {
    readonly subjectId: HeroId
    readonly objectId: HeroId
    readonly score: number
}

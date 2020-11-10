import Backend from "@/ts/Backend";
import MatchupEvaluationUserScore from "data/MatchupEvaluationUserScore";
import HeroDto from "data/dto/HeroDto";
import HeroId from "data/HeroId";
import Authentication from "@/ts/Authentication";


type EvaluationCache = {
    [key: number]: {
        [key: number]: {
            [key: number]: MatchupEvaluationUserScore
        }
    }
}
export default class MatchupEvaluatorService {

    private static _instance: MatchupEvaluatorService

    private static cacheKey = 'matchup-evaluation'

    private readonly cache: EvaluationCache

    private readonly userId: number

    static get instance(): MatchupEvaluatorService {
        if (MatchupEvaluatorService._instance === void 0) {
            if (
                Authentication.instance.userId === void 0
            ) {
                throw new Error('User not authenticated')
            }
            MatchupEvaluatorService._instance = new MatchupEvaluatorService(
                Authentication.instance.userId
            )
        }
        return MatchupEvaluatorService._instance;
    }

    private constructor(userId: number) {
        const cached = localStorage.getItem(MatchupEvaluatorService.cacheKey);
        this.userId = userId
        if (cached !== null) {
            this.cache = JSON.parse(cached)
        } else {
            this.cache = {}
        }
    }

    evaluateMatchup(
        subject: HeroDto,
        object: HeroDto,
        score: MatchupEvaluationUserScore
    ) {
        return Backend.instance
            .evaluateMatchup(subject, object, score)
            .then(() => {
                this.cacheEvaluation(
                    subject.id,
                    object.id,
                    score
                )
            })
    }

    getScore(subject: HeroDto, object: HeroDto): MatchupEvaluationUserScore | null {
        const score = this.cache[this.userId]?.[subject.id]?.[object.id];
        if (score === undefined) {
            return null
        }
        return score;
    }

    private cacheEvaluation(
        subjectId: HeroId,
        objectId: HeroId,
        score: MatchupEvaluationUserScore
    ) {
        if (this.cache[subjectId] === void 0) {
            this.cache[this.userId] = {}
        }
        if (this.cache[this.userId][subjectId] === void 0) {
            this.cache[this.userId][subjectId] = {}
        }
        this.cache[this.userId][subjectId][objectId] = score
        this.saveCache()
    }

    private saveCache() {
        localStorage.setItem(
            MatchupEvaluatorService.cacheKey,
            JSON.stringify(this.cache)
        )
    }

}


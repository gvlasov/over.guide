import Backend from "@/ts/Backend";
import MatchupEvaluationUserScore from "data/MatchupEvaluationUserScore";
import HeroDto from "data/dto/HeroDto";
import HeroId from "data/HeroId";
import Authentication from "@/ts/Authentication";
import heroes from 'data/heroes'
import HeroOpposition from "@/ts/vso/HeroOpposition";

type EvaluationCache = {
    [userId: number]: UserEvaluations
}

type UserEvaluations = {
    [subjectId: number]: {
        [objectId: number]: MatchupEvaluationUserScore
    }
}

type MissingEvaluationCache = {
    [userId: number]: MissingUserEvaluations
}

type MissingUserEvaluations = {
    [subjectId: number]: number[]
}

export default class MatchupEvaluatorService {

    private static _instance: MatchupEvaluatorService

    private static cacheKey = 'matchup-evaluation'

    private readonly cache: EvaluationCache

    private readonly userId: number

    private _rest: MissingEvaluationCache | null = null

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
        if (this.cache[this.userId] === void 0) {
            this.cache[this.userId] = {}
        }
        if (this.cache[this.userId][subjectId] === void 0) {
            this.cache[this.userId][subjectId] = {}
        }
        this.cache[this.userId][subjectId][objectId] = score
        this.saveCache()
        const restIndex = this.rest[this.userId][subjectId].indexOf(objectId);
        if (restIndex > -1) {
            this.rest[this.userId][subjectId].splice(restIndex, 1)
        }
    }

    get rest(): MissingEvaluationCache {
        if (this._rest === null) {
            this._rest = this.initialRest()
        }
        return this._rest
    }

    private initialRest(): MissingEvaluationCache {
        const rest: MissingEvaluationCache = {
            [this.userId]: {}
        }
        const allHeroesIds = Array.from(heroes.values()).map(h => h.id);
        for (let subjectId of allHeroesIds) {
            const perSubject: number[] = []
            for (let objectId of allHeroesIds) {
                if (subjectId === objectId) {
                    continue
                }
                if (this.cache[this.userId]?.[subjectId]?.[objectId] === void 0) {
                    perSubject.push(objectId)
                }
            }
            rest[this.userId][subjectId] = perSubject
        }
        return rest
    }

    private saveCache() {
        localStorage.setItem(
            MatchupEvaluatorService.cacheKey,
            JSON.stringify(this.cache)
        )
    }

    get currentUserData(): UserEvaluations {
        return this.cache[this.userId]
    }

    getRandomUnevaluatedOpposition(): HeroOpposition | null {
        const subjectId2LastCumulIndex: {
            [key: number]: number
        } = {}
        let cumul = 0
        const userRest = this.rest[this.userId];
        const entriesAscendingByHeroId = Object.entries(userRest)
            .sort(([key1, _], [key2, __]) => Number.parseInt(key1) - Number.parseInt(key2));
        for (
            let [subjectId, objectIds] of
            entriesAscendingByHeroId
            ) {
            if (objectIds.length === 0) {
                continue
            }
            cumul += objectIds.length
            subjectId2LastCumulIndex[Number.parseInt(subjectId)] = cumul
        }
        const randomPosition = Math.ceil(Math.random() * cumul)
        const subjectIdsAsc = Object.keys(subjectId2LastCumulIndex)
            .map(k => Number.parseInt(k))
            .sort((a, b) => a - b)
        for (let subjectId of subjectIdsAsc) {
            if (subjectId2LastCumulIndex[subjectId] >= randomPosition) {
                const rightObjectIndex = subjectId2LastCumulIndex[subjectId] - randomPosition;
                console.log(
                    subjectId2LastCumulIndex[subjectId],
                    randomPosition,
                    rightObjectIndex,
                    userRest[subjectId][rightObjectIndex],
                    userRest[subjectId],
                    cumul,
                )
                return {
                    left: heroes.get(subjectId)!,
                    right: heroes.get(userRest[subjectId][rightObjectIndex])!,
                }
            }
        }
        return null
    }

}


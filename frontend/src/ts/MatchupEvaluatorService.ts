import MatchupEvaluationUserScore from "data/MatchupEvaluationUserScore";
import HeroId from "data/HeroId";
import Authentication from "@/ts/Authentication";
import heroes from 'data/heroes'
import HeroOpposition from "@/ts/vso/HeroOpposition";
import MatchupEvaluationVso from "@/ts/vso/MatchupEvaluationVso";
import patches from 'data/patches';
import _ from 'lodash'
import PatchDto from "data/dto/PatchDto";

const scoreIndex = 1
const patchIndex = 0

type EvaluationCache = {
    [userId: number]: UserEvaluations
}

type UserEvaluations = {
    [subjectId: number]: {
        [objectId: number]: [number, MatchupEvaluationUserScore],
    }
}

type MissingEvaluationCache = {
    [userId: number]: MissingUserEvaluations
}

type MissingUserEvaluations = {
    [subjectId: number]: number[]
}

export type EvaluationOption = {
    score: MatchupEvaluationUserScore | null,
    label: string,
    shortLabel: string,
    icon: string | null,
    classSuffix: string,
}

export default class MatchupEvaluatorService {

    private static _instance: MatchupEvaluatorService

    private static cacheKey = 'matchup-evaluation'

    private readonly cache: EvaluationCache

    private readonly userId: number

    private readonly patchId: number

    private _rest: MissingEvaluationCache | null = null

    options: EvaluationOption[] = [
        {
            score: MatchupEvaluationUserScore.HardCounters,
            label: 'hard counters',
            shortLabel: '<<',
            icon: 'angle-double-right',
            classSuffix: 'hard-counters',
        },
        {
            score: MatchupEvaluationUserScore.Counters,
            label: 'counters',
            shortLabel: '<',
            icon: 'angle-right',
            classSuffix: 'counters',
        },
        {
            score: MatchupEvaluationUserScore.Ok,
            label: 'is ok against',
            shortLabel: '=',
            icon: null,
            classSuffix: 'ok',
        },
        {
            score: MatchupEvaluationUserScore.Countered,
            label: 'countered by',
            icon: 'angle-left',
            shortLabel: '>',
            classSuffix: 'countered',
        },
        {
            score: MatchupEvaluationUserScore.HardCountered,
            label: 'hard countered by',
            icon: 'angle-double-left',
            shortLabel: '>>',
            classSuffix: 'hard-countered',
        },
    ]

    dontKnowOption: EvaluationOption = {
        score: MatchupEvaluationUserScore.DontKnow,
        label: 'skip',
        icon: 'question',
        shortLabel: '??',
        classSuffix: 'dont-know',
    }

    clearOption: EvaluationOption = {
        score: null,
        label: 'clear',
        icon: 'question',
        shortLabel: 'xx',
        classSuffix: 'clear',
    }

    static get instance(): MatchupEvaluatorService {
        if (MatchupEvaluatorService._instance === void 0) {
            if (
                Authentication.instance.userId === void 0
            ) {
                throw new Error('User not authenticated')
            }
            MatchupEvaluatorService._instance = new MatchupEvaluatorService(
                Authentication.instance.userId,
                (_.maxBy(
                    Array.from(patches.values()),
                    (value) => value.id
                ) as PatchDto).id
            )
        }
        return MatchupEvaluatorService._instance;
    }

    private constructor(userId: number, patchId: number) {
        const cached = localStorage.getItem(MatchupEvaluatorService.cacheKey);
        this.userId = userId
        this.patchId = patchId
        if (cached !== null) {
            this.cache = JSON.parse(cached)
        } else {
            this.cache = {}
        }
    }

    getScore(opposition: HeroOpposition): MatchupEvaluationUserScore | null {
        const patchScore = this.cache[this.userId]?.[opposition.left.id]?.[opposition.right.id];
        if (patchScore === undefined) {
            return null
        }
        return patchScore[scoreIndex];
    }

    cacheEvaluation(
        evaluation: MatchupEvaluationVso
    ) {
        if (evaluation.score === null) {
            delete this.cache[this.userId][evaluation.opposition.left.id][evaluation.opposition.right.id]
        } else {
            if (this.cache[this.userId] === void 0) {
                this.cache[this.userId] = {}
            }
            if (this.cache[this.userId][evaluation.opposition.left.id] === void 0) {
                this.cache[this.userId][evaluation.opposition.left.id] = {}
            }
            if (this.cache[this.userId][evaluation.opposition.left.id][evaluation.opposition.right.id] === void 0) {
                this.cache[this.userId][evaluation.opposition.left.id][evaluation.opposition.right.id] = [
                    this.patchId,
                    evaluation.score
                ]
            } else {
                this.cache[this.userId][evaluation.opposition.left.id][evaluation.opposition.right.id][scoreIndex] = evaluation.score
            }
        }
        this.saveCache()
        if (evaluation.score === null) {
            this.rest[this.userId][evaluation.opposition.left.id].push(evaluation.opposition.right.id)
        } else {
            const restIndex = this.rest[this.userId][evaluation.opposition.left.id]
                .indexOf(evaluation.opposition.right.id);
            if (restIndex > -1) {
                this.rest[this.userId][evaluation.opposition.left.id].splice(restIndex, 1)
            }
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

    get myEvaluatedOppositionsCount(): number {
        const userCache = this.cache[this.userId];
        let count = 0
        for (let subjectId in userCache) {
            if (userCache.hasOwnProperty(subjectId)) {
                count +=
                    Object.values(userCache[subjectId])
                        .filter(value => value[scoreIndex] !== MatchupEvaluationUserScore.DontKnow)
                        .length
            }
        }
        return count
    }

    get skippedCount(): number {
        const userCache = this.cache[this.userId];
        let count = 0
        for (let subjectId in userCache) {
            if (userCache.hasOwnProperty(subjectId)) {
                count +=
                    Object.values(userCache[subjectId])
                        .filter(value => value[scoreIndex] === MatchupEvaluationUserScore.DontKnow)
                        .length
            }
        }
        return count
    }

    get possibleEvaluationsCount(): number {
        const heroesNumber = Array.from(Object.values(HeroId))
            .filter(v => typeof v === 'number')
            .length;
        return heroesNumber * (heroesNumber - 1)
    }

    private saveCache() {
        localStorage.setItem(
            MatchupEvaluatorService.cacheKey,
            JSON.stringify(this.cache)
        )
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
                return {
                    left: heroes.get(subjectId)!,
                    right: heroes.get(userRest[subjectId][rightObjectIndex])!,
                }
            }
        }
        return null
    }

}


import {Injectable} from '@nestjs/common';
import Hero from "src/data/dto/Hero";
import PickContext from "src/data/dto/PickContext";
import Alternative from "src/data/dto/Alternative";
import heroes from "src/data/heroes"
import Role from 'src/data/Role';
import {MatchupEvaluationService} from "src/services/matchup-evaluation.service";
import * as sum from 'lodash.sum';

@Injectable()
export class SuggestPickService {
    constructor(
        private readonly evaluation: MatchupEvaluationService
    ) {
    }

    suggestPick(context: PickContext): Alternative[] {
        console.log(context)
        const allyHeroes: Hero[] = context.allyComp.map(h => heroes.get(h))
        console.log(allyHeroes)
        console.log(heroes)
        const enemyHeroes: Hero[] = context.enemyComp.map(h => heroes.get(h))
        const missingRole = SuggestPickService.getMissingRole(allyHeroes)
        return Array.from(heroes.values())
            .filter(
                hero =>
                    hero.role === missingRole
                    && !allyHeroes.some(
                    h => hero.dataName === h.dataName
                    )
            )
            .map(hero => [hero, this.pickScore(enemyHeroes, hero)])
            .sort((a: [Hero, number], b: [Hero, number]) => a[1] - b[1])
            .map(
                hero2Score => ({
                    dataName: (hero2Score[0] as Hero).dataName,
                    score: hero2Score[1]
                } as Alternative)
            )
    }

    private static getMissingRole(heroes: Hero[]): Role {
        let tanks = 0
        let damage = 0
        let support = 0
        console.log(heroes)
        for (let hero of heroes) {
            if (hero === null) {
                continue;
            }
            if (hero.role === Role.Tank) {
                tanks++
            } else if (hero.role === Role.Damage) {
                damage++
            } else if (hero.role === Role.Support) {
                support++
            }
        }
        if (tanks == 1) {
            if (damage != 2 || support != 2) {
                throw new Error("Wrong team comp: " + JSON.stringify(heroes))
            }
            return Role.Tank
        } else if (damage == 1) {
            if (tanks != 2 || support != 2) {
                throw new Error("Wrong team comp: " + JSON.stringify(heroes))
            }
            return Role.Damage
        } else if (support == 1) {
            if (tanks != 2 || damage != 2) {
                throw new Error("Wrong team comp: " + JSON.stringify(heroes))
            }
            return Role.Support
        }
        throw new Error("Wrong team comp: " + JSON.stringify(heroes))
    }

    pickScore(enemyHeroes: Hero[], hero: Hero): number {
        return sum(
            enemyHeroes
                .map(enemy => this.evaluation.evaluate(hero, enemy))
        );
    }

}

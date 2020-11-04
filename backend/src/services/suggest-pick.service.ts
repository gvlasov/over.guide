import {Injectable} from '@nestjs/common';
import HeroDto from "data/dto/HeroDto";
import PickContextDto from "data/dto/PickContextDto";
import AlternativeDto from "data/dto/AlternativeDto";
import heroes from "src/data/heroes"
import Role from 'src/data/Role';
import {OldJsonMatchupEvaluationService} from "src/services/old-json-matchup-evaluation.service";
import sum from 'lodash.sum';

@Injectable()
export class SuggestPickService {
    constructor(
        private readonly evaluation: OldJsonMatchupEvaluationService
    ) {
    }

    suggestPick(context: PickContextDto): AlternativeDto[] {
        const teammateHeroes: HeroDto[] = context.teammateComp.map(h => heroes.get(h))
        const enemyHeroes: HeroDto[] = context.enemyComp.map(h => heroes.get(h))
        const missingRole = SuggestPickService.getMissingRole(teammateHeroes)
        return Array.from(heroes.values())
            .filter(
                hero =>
                    hero.role === missingRole
                    && !teammateHeroes.some(
                    h => hero.dataName === h.dataName
                    )
            )
            .map(hero => [hero, this.pickScore(enemyHeroes, hero)])
            .sort((a: [HeroDto, number], b: [HeroDto, number]) => a[1] - b[1])
            .map(
                hero2Score => ({
                    heroId: (hero2Score[0] as HeroDto).id,
                    score: hero2Score[1]
                } as AlternativeDto)
            )
    }

    private static getMissingRole(heroes: HeroDto[]): Role {
        let tanks = 0
        let damage = 0
        let support = 0
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

    pickScore(enemyHeroes: HeroDto[], hero: HeroDto): number {
        return sum(
            enemyHeroes
                .map(enemy => this.evaluation.evaluate(hero, enemy))
        );
    }

}

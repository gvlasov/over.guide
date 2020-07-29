import './Pick'
import AlternativeDto from 'data/dto/AlternativeDto'
import heroes from "data/heroes";
import sortBy from 'lodash/sortBy';
import HeroDto from "data/dto/HeroDto";

class PickSuggestion {
    private readonly alternatives: AlternativeDto[];

    constructor(alternatives: AlternativeDto[]) {
        this.alternatives = alternatives;
    }

    heroesSorted(sortFunction: (alternative: AlternativeDto) => number): HeroDto[] {
        return sortBy(this.alternatives, sortFunction)
            .map<HeroDto>(a => heroes.get(a.heroId) as HeroDto);
    }

    score(hero: HeroDto): number {
        const bestAlternative =
            this.alternatives.find(
                alternative => alternative.heroId === hero.id
            );
        if (typeof bestAlternative === 'undefined') {
            throw new Error(hero.name + " is not in suggestion");
        }
        return bestAlternative.score;
    };

    toMap(): Map<HeroDto, Number> {
        const map = new Map();
        for (let hero of this.heroesSorted(h => (h.score))) {
            map.set(hero, this.score(hero))
        }
        return map;
    };

}

export default PickSuggestion;

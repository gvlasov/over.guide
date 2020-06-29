import './Pick'
import Alternative from 'data/dto/Alternative'
import heroes from "data/heroes";
import sortBy from 'lodash/sortBy';
import Hero from "data/dto/Hero";

class PickSuggestion {
    private readonly alternatives: Alternative[];

    constructor(alternatives: Alternative[]) {
        this.alternatives = alternatives;
    }

    heroesSorted(sortFunction: (alternative: Alternative) => number): Hero[] {
        return sortBy(this.alternatives, sortFunction)
            .map<Hero>(a => heroes.get(a.dataName) as Hero);
    }

    score(hero: Hero): number {
        const bestAlternative =
            this.alternatives.find(
                alternative => alternative.dataName === hero.dataName
            );
        if (typeof bestAlternative === 'undefined') {
            throw new Error(hero.name + " is not in suggestion");
        }
        return bestAlternative.score;
    };

    toMap(): Map<Hero, Number> {
        const map = new Map();
        for (let hero of this.heroesSorted(h => (h.score))) {
            map.set(hero, this.score(hero))
        }
        return map;
    };

}

export default PickSuggestion;

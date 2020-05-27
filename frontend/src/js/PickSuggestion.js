import './PickOption'
import './Pick'
import Alternative from './dto/Alternative.js'
import heroes from "./heroes";
import _ from 'lodash';

/**
 * @param {Alternative[]} alternatives
 * @property {Alternative[]} alternatives
 * @constructor
 */
function PickSuggestion(alternatives) {
    this.alternatives = alternatives;
}

/**
 * @param {function} sortFunction
 * @returns {Hero[]}
 */
PickSuggestion.prototype.heroesSorted = function (sortFunction) {
    return _
        .sortBy(this.alternatives, sortFunction)
        .map(a => heroes.find(hero => hero.equals(a)));
};

/**
 *
 * @param {Hero} hero
 * @returns {number} Hero suitability score
 */
PickSuggestion.prototype.score = function (hero) {
    const bestAlternative =
        this.alternatives.find(
            alternative => alternative.dataName === hero.dataName
        );
    if (typeof bestAlternative === 'undefined') {
        throw new Error(hero.name + " is not in suggestion");
    }
    return bestAlternative.score;
};
/**
 * @return {Map<Hero, Number>}
 */
PickSuggestion.prototype.toMap = function () {
    const map = new Map();
    for (let hero of this.heroesSorted(h => h.score)) {
        map.set(hero, this.score(hero))
    }
    return map;
};


export default PickSuggestion;

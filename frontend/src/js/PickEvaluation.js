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
function PickEvaluation(alternatives) {
    this.alternatives = alternatives;
}

/**
 * @param {function} sortFunction
 * @returns {Hero[]}
 */
PickEvaluation.prototype.heroesSorted = function (sortFunction) {
    return _
        .sortBy(this.alternatives, sortFunction)
        .map(a => heroes.find(hero => hero.dataName === a.dataName))
};

/**
 *
 * @param {Hero} hero
 * @returns {number} Hero suitability score
 */
PickEvaluation.prototype.score = function (hero) {
    const bestAlternative =
        this.alternatives.find(
            alternative => alternative.dataName === hero.dataName
        );
    return bestAlternative.score;
};


export default PickEvaluation;

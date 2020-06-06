import heroes from "../heroes";

/**
 * @property {String} abilityName
 * @property {Hero} hero
 * @property {number} score
 */
function AbilityEvaluation(data) {
    this.abilityName = data.ability;
    this.hero = heroes.find(h => h.dataName === data.object);
    this.description = data.description;
}

export default AbilityEvaluation;

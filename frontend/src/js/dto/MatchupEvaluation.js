import heroes from "../heroes";
import AbilityEvaluation from "./AbilityUseEvaluation";

/**
 * @property {Hero} subject
 * @property {Hero} object
 * @property {number} score
 * @property {AbilityEvaluation[]} abilityUses
 * @property {AbilityEvaluation[]} abilityCounters
 */
function MatchupEvaluation(data) {
    this.subject = heroes.find(h => h.dataName === data.subject);
    this.object = heroes.find(h => h.dataName === data.object);
    this.score = data.score;
    this.abilityUses = data.abilityUses.map(
        e => new AbilityEvaluation(e)
    );
    this.abilityCounters = data.abilityCounters.map(
        e => new AbilityEvaluation(e)
    );
}

export default MatchupEvaluation;

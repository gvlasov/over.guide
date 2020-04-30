import heroes from "../js/heroes.js";
import seedrandom from "seedrandom";
import shuffle from "fast-shuffle";
import AllyPicks from "../js/AllyPicks.js";

/**
 * @constructor
 */
function AllyPicksGenerator() {

}

/**
 * @param {string|undefined} yourRole
 * @param {number|string} seed
 * @returns {AllyPicks}
 */
AllyPicksGenerator.prototype.generateForRole = function (yourRole, seed) {
    let random = seedrandom(seed);
    var supports =
        shuffle(
            heroes.filter(hero => hero.isSupport()),
            () => random()
        )
            .slice(0, yourRole === 'Support' ? 1 : 2);
    if (yourRole === 'Support') {
        supports.push(null);
    }
    var tanks =
        shuffle(
            heroes.filter(hero => hero.isTank()),
            () => random()
        )
            .slice(0, yourRole === 'Tank' ? 1 : 2);
    if (yourRole === 'Tank') {
        tanks.push(null);
    }
    var damage =
        shuffle(
            heroes.filter(hero => hero.isDamage()),
            () => random()
        )
            .slice(0, yourRole === 'Damage' ? 1 : 2);
    if (yourRole === 'Damage') {
        damage.push(null);
    }
    return new AllyPicks(tanks.concat(damage).concat(supports))
};
/**
 * @param {number} seed
 */
AllyPicksGenerator.prototype.generateSeeded = function (seed) {

    var random = Math.ceil(seedrandom(seed)() * 3);
    if (random === 0) {
        return this.generateForRole('Tank', seed);
    } else if (random === 1) {
        return this.generateForRole('Support', seed);
    } else {
        return this.generateForRole('Damage', seed);
    }
};

export default AllyPicksGenerator;

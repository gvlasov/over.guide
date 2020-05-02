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
 * @param {string|object} yourRole null to generate all 6 picks, role name string to generate ally picks
 * @param {number|string} seed
 * @returns {AllyPicks}
 */
AllyPicksGenerator.prototype.generateForRole = function (yourRole, seed) {
    if (
        ![null, 'Tank', 'Damage', 'Support'].includes(yourRole)
    ) {
        throw new Error("Role must be 'Tank', 'Damage', 'Support' or null");
    }
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
 * @return {AllyPicks}
 */
AllyPicksGenerator.prototype.generateSeeded = function (seed) {
    const random = Math.ceil(seedrandom(seed)() * 3);
    if (random === 1) {
        return this.generateForRole('Tank', seed);
    } else if (random === 2) {
        return this.generateForRole('Support', seed);
    } else {
        return this.generateForRole('Damage', seed);
    }
};

export default AllyPicksGenerator;

import heroes from "../js/heroes.js";
import seedrandom from "seedrandom";
import shuffle from "fast-shuffle";
import AllyPicks from "../js/AllyPicks.js";
import RoleGenerator from "./RoleGenerator";

/**
 * @constructor
 * @param {Hero[]} bans
 */
function TeamCompGenerator(bans) {
    this.bans = bans;
}

/**
 * @param {string|null} yourRole null to generate all 6 picks, role name string to generate ally picks
 * @param {number|string} seed
 * @returns {AllyPicks}
 */
TeamCompGenerator.prototype.generateForRole = function (yourRole, seed) {
    if (
        ![null, 'Tank', 'Damage', 'Support'].includes(yourRole)
    ) {
        throw new Error("Role must be 'Tank', 'Damage', 'Support' or null");
    }
    let random = seedrandom(seed);
    const availableHeroes = heroes.filter(hero => !this.bans.includes(hero));
    const supports =
        shuffle(
            availableHeroes.filter(hero => hero.isSupport()),
            () => random()
        )
            .slice(0, yourRole === 'Support' ? 1 : 2);
    if (yourRole === 'Support') {
        supports.push(null);
    }
    const tanks =
        shuffle(
            availableHeroes.filter(hero => hero.isTank()),
            () => random()
        )
            .slice(0, yourRole === 'Tank' ? 1 : 2);
    if (yourRole === 'Tank') {
        tanks.push(null);
    }
    const damage =
        shuffle(
            availableHeroes.filter(hero => hero.isDamage()),
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
TeamCompGenerator.prototype.generateSeeded = function (seed) {
    return this.generateForRole(
        new RoleGenerator().generate(seed),
        seed
    );
};

/**
 * Generate team composition with all 6 heroes
 * @param {number} seed
 * @returns {AllyPicks}
 */
TeamCompGenerator.prototype.generateComplete = function (seed) {
    return this.generateForRole(null, seed);
};

export default TeamCompGenerator;

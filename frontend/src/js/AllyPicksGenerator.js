var heroes = require('../js/heroes.js');
var _ = require('lodash');
var Random = require('java-random');
var shuffle = require('fast-shuffle').default;
var AllyPicks = require('../js/AllyPicks.js');

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
    let random = new Random(seed);
    var supports =
        shuffle(
            heroes.filter(hero => hero.isSupport()),
            () => random.nextDouble()
        )
            .slice(0, yourRole === 'Support' ? 1 : 2);
    if (yourRole === 'Support') {
        supports.push(null);
    }
    var tanks =
        shuffle(
            heroes.filter(hero => hero.isTank()),
            () => random.nextDouble()
        )
            .slice(0, yourRole === 'Tank' ? 1 : 2);
    if (yourRole === 'Tank') {
        tanks.push(null);
    }
    var damage =
        shuffle(
            heroes.filter(hero => hero.isDamage()),
            () => random.nextDouble()
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

    var random = (new Random(seed)).nextInt() % 3;
    if (random === 0) {
        return this.generateForRole('Tank', seed);
    } else if (random === 1) {
        return this.generateForRole('Support', seed);
    } else {
        return this.generateForRole('Damage', seed);
    }
};

module.exports = AllyPicksGenerator;

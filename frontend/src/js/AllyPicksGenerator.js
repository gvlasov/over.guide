var heroes = require('../js/heroes.js');
var _ = require('lodash');
var seedrandom = require('seedrandom');
var seededshuffle = require('seededshuffle');
var AllyPicks = require('../js/AllyPicks.js');

/**
 * @constructor
 */
function AllyPicksGenerator() {

/**
 * @param {string|undefined} yourRole
 * @param {number|string} seed
 * @returns {AllyPicks}
 */
AllyPicksGenerator.prototype.generateForRole = function (yourRole, seed) {
    var supports =
        seededshuffle.shuffle(
            heroes.filter(hero => hero.isSupport()),
            seed,
            true
        )
            .slice(0, yourRole === 'Support' ? 1 : 2);
    if (yourRole === 'Support') {
        supports.push(null);
    }
    var tanks =
        seededshuffle.shuffle(
            heroes.filter(hero => hero.isTank()),
            seed,
            true
        )
            .slice(0, yourRole === 'Tank' ? 1 : 2);
    if (yourRole === 'Tank') {
        tanks.push(null);
    }
    var damage =
        seededshuffle.shuffle(
            heroes.filter(hero => hero.isDamage()),
            seed,
            true
        )
            .slice(0, yourRole === 'Damage' ? 1 : 2);
    if (yourRole === 'Damage') {
        damage.push(null);
    }
    return new AllyPicks(tanks.concat(damage).concat(supports))
};
    /**
     * @param {string} seed
     */
    AllyPicksGenerator.prototype.generateSeeded = function (seed) {
        var random = Math.ceil(seedrandom(seed)() * 3);
        if (random === 1) {
            return this.generateForRole('Tank', seed);
        } else if (random === 2) {
            return this.generateForRole('Support', seed);
        } else {
            return this.generateForRole('Damage', seed);
        }
    }

}
module.exports = AllyPicksGenerator;

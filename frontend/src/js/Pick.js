/**
 * @param {Hero} hero
 * @param {Hero[]} allyHeroes
 * @param {Hero[]} enemyHeroes
 * @param {Hero[]} bans
 * @param {string} map
 * @constructor
 */
function Pick(
    hero,
    allyHeroes,
    enemyHeroes,
    bans,
    map
) {
    this.hero = hero;
    this.allyHeroes = allyHeroes;
    this.enemyHeroes = enemyHeroes;
    this.bans = bans;
    this.map = map;
}

Pick.prototype.forRequest = function () {
    return {
        myPick: this.hero.dataName,
        allyPicks: this.allyHeroes.map(hero => hero.dataName),
        enemyPicks: this.enemyHeroes.map(hero => hero.dataName),
        bans: this.bans.map(hero => hero.dataName),
        map: this.map
    }
};
export default Pick;
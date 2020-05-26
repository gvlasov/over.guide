import heroes from "./heroes";

/**
 * @param {TeamComp} allyHeroes
 * @param {Hero[]} enemyHeroes
 * @param {Hero[]} bans
 * @param {string|null} map
 * @constructor
 */
function PickContext(
    allyHeroes,
    enemyHeroes,
    bans,
    map
) {
    this.allyHeroes = allyHeroes;
    this.enemyHeroes = enemyHeroes;
    this.bans = bans;
    this.map = map;
}

PickContext.prototype.forRequest = function () {
    return {
        myPick: this.hero.dataName,
        allyPicks: this.allyHeroes.map(hero => hero.dataName),
        enemyPicks: this.enemyHeroes.map(hero => hero.dataName),
        bans: this.bans.map(hero => hero.dataName),
        map: this.map
    }
};

/**
 * @returns {Hero[]}
 */
PickContext.prototype.heroesLeftForRoster = function () {
    const remainingRole = this.allyHeroes.remainingRole();
    return heroes.filter(
        hero =>
            !this.allyHeroes.heroes.find(
                allyHero => allyHero !== null && allyHero.dataName === hero.dataName
            )
            && hero.role === remainingRole
    );
};
export default PickContext;
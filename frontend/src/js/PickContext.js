import heroes from "./heroes";

/**
 * @param {TeamComp} allyComp
 * @param {TeamComp} enemyComp
 * @param {Hero[]} bans
 * @param {?string} map
 * @constructor
 */
function PickContext(
    allyComp,
    enemyComp,
    bans,
    map
) {
    this.allyComp = allyComp;
    this.enemyComp = enemyComp;
    this.bans = bans;
    this.map = map;
}

PickContext.prototype.forRequest = function () {
    return {
        myPick: this.hero.dataName,
        allyPicks: this.allyComp.heroes.map(hero => hero.dataName),
        enemyPicks: this.enemyComp.heroes.map(hero => hero.dataName),
        bans: this.bans.map(hero => hero.dataName),
        map: this.map
    }
};

/**
 * @returns {Hero[]}
 */
PickContext.prototype.heroesLeftForRoster = function () {
    const remainingRole = this.allyComp.remainingRole();
    return heroes.filter(
        hero =>
            !this.allyComp.heroes.find(
                allyHero => allyHero !== null && allyHero.equals(hero)
            )
            && hero.role === remainingRole
    );
};
export default PickContext;
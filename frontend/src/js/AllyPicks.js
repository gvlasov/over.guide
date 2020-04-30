import _ from "lodash";

/**
 * @param {(Hero|null)[]} heroes
 * @constructor
 */
function AllyPicks(heroes) {
    if (heroes.length !== 6 || !heroes.includes(null)) {
        throw new Error(
            "There must be exactly 6 positions in ally picks, one of which is null"
        )
    }
    if (
        _.uniq(
            heroes.map(hero => hero === null ? null : hero.name)
        )
            .length < heroes.length
    ) {
        throw new Error(
            "Heroes in a team composition must be unique"
        );
    }
    this.heroes = heroes;
}

AllyPicks.prototype.getCompletelyPickedCategories = function () {
    let tanks = 0,
        supports = 0,
        damage = 0;
    let roles = this.heroes.filter(it => it !== null).map((hero) => hero.role);
    for (let role of roles) {
        if (role === 'Tank') {
            tanks++;
        } else if (role === 'Support') {
            supports++;
        } else if (role === 'Damage') {
            damage++;
        } else {
            throw new Error('Unknown role ' + role)
        }
    }
    let answer = [];
    if (supports === 2) {
        answer.push('Support');
    }
    if (damage === 2) {
        answer.push('Damage');
    }
    if (tanks === 2) {
        answer.push('Tank');
    }
    return answer;
};


export default AllyPicks;

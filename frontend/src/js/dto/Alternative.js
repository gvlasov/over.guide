import heroes from "../heroes";

/**
 * @property {String} dataName
 * @property {number} score
 */
function Alternative(data) {
    Object.assign(this, data);
}

/**
 * @return {Hero}
 */
Alternative.prototype.hero = function () {
    const hero = heroes.find(h => h.dataName === this.dataName);
    if (typeof hero === 'undefined') {
        throw new Error('No hero with name ' + this.dataName);
    }
    return hero;
};

export default Alternative;

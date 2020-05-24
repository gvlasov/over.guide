import seedrandom from "seedrandom";

/**
 * @constructor
 */
function RoleGenerator() {
}

/**
 * @param {number} seed
 * @return {string}
 */
RoleGenerator.prototype.generate = function (seed) {
    const random = Math.ceil(seedrandom(seed)() * 3);
    if (random === 1) {
        return 'Tank';
    } else if (random === 2) {
        return 'Support';
    } else {
        return 'Damage';
    }
};

export default RoleGenerator;

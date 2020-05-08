/**
 * @param {object} data
 * @property {string} name
 * @property {string} role
 * @property {string} imgName
 * @property {string} dataName
 * @constructor
 */
function Hero(data) {
    Object.assign(this, data)
}
Hero.prototype.isTank = function () {
    return this.role === 'Tank';
};
Hero.prototype.isDamage = function () {
    return this.role === 'Damage';
};
Hero.prototype.isSupport = function () {
    return this.role === 'Support';
};
export default Hero;

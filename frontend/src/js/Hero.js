function Hero(data) {
    Object.assign(this, data)
}
Hero.prototype.imgSrc = function () {
    return "https://d1u1mce87gyfbn.cloudfront.net/hero/" + this.imgName + "/hero-select-portrait.png"
};
Hero.prototype.isTank = function () {
    return this.role === 'Tank';
};
Hero.prototype.isDamage = function () {
    return this.role === 'Damage';
};
Hero.prototype.isSupport = function () {
    return this.role === 'Support';
};
module.exports = Hero;

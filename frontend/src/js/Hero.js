function Hero(data) {
    Object.assign(this, data)
}
Hero.prototype.imgSrc = function () {
    return "https://d1u1mce87gyfbn.cloudfront.net/hero/" + this.imgName + "/hero-select-portrait.png"
};
module.exports = Hero;

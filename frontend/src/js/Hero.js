function Hero(data) {
    this.data = data;
}
Hero.prototype.imgSrc = function () {
    return "https://d1u1mce87gyfbn.cloudfront.net/hero/" + this.data.imgName + "/hero-select-portrait.png"
};
module.exports = Hero;

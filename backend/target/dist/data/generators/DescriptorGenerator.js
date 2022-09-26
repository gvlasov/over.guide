"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GuideDescriptorDto_1 = __importDefault(require("../dto/GuideDescriptorDto"));
const GuideDescriptorQuickie_1 = __importDefault(require("../dto/GuideDescriptorQuickie"));
const heroes_1 = __importDefault(require("../heroes"));
const thematicTags_1 = __importDefault(require("../thematicTags"));
const abilities_1 = __importDefault(require("../abilities"));
const AbilityId_1 = __importDefault(require("../AbilityId"));
const SeededShuffler_1 = __importDefault(require("./SeededShuffler"));
const HeroDto_1 = __importDefault(require("../dto/HeroDto"));
const allHeroes = Array.from(heroes_1.default.values());
const allThemes = Array.from(thematicTags_1.default.values());
const allAbilities = Array.from(abilities_1.default.values());
class DescriptorGenerator {
    constructor(config) {
        this.config = config;
    }
    generate(seed) {
        const shuffler = new SeededShuffler_1.default(seed);
        const heroNumber = this.resolveAmountSpecifier(this.config.numberOfHeroTags);
        const themeNumber = this.resolveAmountSpecifier(this.config.numberOfThematicTags);
        const heroes = shuffler.shuffle(allHeroes).slice(0, heroNumber);
        const themes = shuffler.shuffle(allThemes).slice(0, themeNumber);
        const buckets = this.splitInto3Buckets(heroNumber);
        const playerHeroes = heroes.slice(0, buckets[0]);
        const teammateHeroes = heroes.slice(buckets[0], buckets[1]);
        const enemyHeroes = heroes.slice(buckets[0] + buckets[1], buckets[2]);
        const playerAbilities = this.getGroupAbilities(playerHeroes, shuffler);
        const teammateAbilities = this.getGroupAbilities(teammateHeroes, shuffler);
        const enemyAbilities = this.getGroupAbilities(enemyHeroes, shuffler);
        return new GuideDescriptorQuickie_1.default({
            playerHeroes: playerHeroes.map(h => h.id),
            playerAbilities: playerAbilities,
            teammateHeroes: teammateHeroes.map(h => h.id),
            teammateAbilities: teammateAbilities,
            enemyHeroes: enemyHeroes.map(h => h.id),
            enemyAbilities: enemyAbilities,
            mapTags: [],
            thematicTags: themes.map(t => t.id)
        });
    }
    getGroupAbilities(heroes, shuffler) {
        return heroes.map(h => shuffler.shuffle(allAbilities.filter(a => a.heroId === h.id))
            .slice(0, this.resolveAmountSpecifier(this.config.abilitiesPerHero))
            .map(a => a.id)).reduce((x, y) => x.concat(y), []);
    }
    resolveAmountSpecifier(spec) {
        if (spec instanceof Array) {
            return this.randomIntFromInterval(spec[0], spec[1]);
        }
        else if (typeof spec === 'number') {
            return spec;
        }
        else {
            throw new Error(`Unsupported spec value ${JSON.stringify(spec)}`);
        }
    }
    splitInto3Buckets(value) {
        const buckets = [0, 0, 0];
        for (let i = 0; i < value; i++) {
            buckets[this.randomIntFromInterval(0, 2)]++;
        }
        return buckets;
    }
    randomIntFromInterval(min, max) {
        if (min > max) {
            throw new Error(`min must be <= max; min is ${min}, max is ${max}`);
        }
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
exports.default = DescriptorGenerator;
//# sourceMappingURL=DescriptorGenerator.js.map
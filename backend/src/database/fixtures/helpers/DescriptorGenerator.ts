import GuideDescriptorDto from "data/dto/GuideDescriptorDto";
import GuideDescriptorQuickie from "data/dto/GuideDescriptorQuickie";
import heroes from 'data/heroes'
import thematicTags from "data/thematicTags";
import abilities from 'data/abilities'
import SeededShuffler from "@fixtures/helpers/SeededShuffler";
import AbilityId from "data/AbilityId";

interface DescriptorGeneratorConfig {
    numberOfHeroTags: AmountSpecifier
    numberOfThematicTags: AmountSpecifier
    abilitiesPerHero: AmountSpecifier
}

const allHeroes = Array.from(heroes.values())
const allThemes = Array.from(thematicTags.values())
const allAbilities = Array.from(abilities.values())

type AmountSpecifier = [number, number] | number

export default class DescriptorGenerator {

    constructor(private readonly config: DescriptorGeneratorConfig) {
    }

    generate(seed: number): GuideDescriptorDto {
        const shuffler = new SeededShuffler(seed)
        const heroNumber = this.resolveAmountSpecifier(this.config.numberOfHeroTags)
        const themeNumber = this.resolveAmountSpecifier(this.config.numberOfThematicTags)
        const heroes = shuffler.shuffle(allHeroes).slice(0, heroNumber)
        const themes = shuffler.shuffle(allThemes).slice(0, themeNumber)
        const buckets = this.splitInto3Buckets(heroNumber)
        const playerHeroes = heroes.slice(0, buckets[0])
        const teammateHeroes = heroes.slice(buckets[0], buckets[1])
        const enemyHeroes = heroes.slice(buckets[0] + buckets[1], buckets[2])
        const playerAbilities =
            this.getGroupAbilities(playerHeroes, shuffler);
        const teammateAbilities =
            this.getGroupAbilities(teammateHeroes, shuffler);
        const enemyAbilities =
            this.getGroupAbilities(enemyHeroes, shuffler);

        return new GuideDescriptorQuickie(
            {
                playerHeroes: playerHeroes.map(h => h.id),
                playerAbilities: playerAbilities,
                teammateHeroes: teammateHeroes.map(h => h.id),
                teammateAbilities: teammateAbilities,
                enemyHeroes: enemyHeroes.map(h => h.id),
                enemyAbilities: enemyAbilities,
                mapTags: [],
                thematicTags: themes.map(t => t.id)
            }
        )
    }

    private getGroupAbilities(heroes, shuffler: SeededShuffler): AbilityId[] {
        return heroes.flatMap(h =>
            shuffler.shuffle(allAbilities.filter(a => a.heroId === h.id))
                .slice(0, this.resolveAmountSpecifier(this.config.abilitiesPerHero))
                .map(a => a.id)
        );
    }

    private resolveAmountSpecifier(spec: AmountSpecifier) {
        if (spec instanceof Array) {
            return this.randomIntFromInterval(spec[0], spec[1])
        } else if (typeof spec === 'number') {
            return spec
        } else {
            throw new Error(
                `Unsupported spec value ${JSON.stringify(spec)}`
            )
        }
    }

    private splitInto3Buckets(value: number): number[] {
        const buckets = [0, 0, 0];
        for (let i = 0; i < value; i++) {
            buckets[this.randomIntFromInterval(0, 2)]++
        }
        return buckets
    }

    private randomIntFromInterval(min, max) {
        if (min > max) {
            throw new Error(
                `min must be <= max; min is ${min}, max is ${max}`
            )
        }
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
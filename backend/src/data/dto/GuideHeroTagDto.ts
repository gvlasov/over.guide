import HeroId from "data/HeroId";
import AbilityId from "data/AbilityId";

export default interface GuideHeroTagDto {
    readonly playerHeroes: HeroId[];
    readonly playerAbilities: AbilityId[];
    readonly teammateHeroes: HeroId[];
    readonly teammateAbilities: AbilityId[];
    readonly enemyHeroes: HeroId[];
    readonly enemyAbilities: AbilityId[];
}

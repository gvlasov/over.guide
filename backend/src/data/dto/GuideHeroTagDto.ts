import HeroId from "data/HeroId";
import AbilityId from "data/AbilityId";

export default interface GuideHeroTagDto {
    readonly playerHeroes: HeroId[];
    readonly playerAbilities: AbilityId[];
    readonly allyHeroes: HeroId[];
    readonly allyAbilities: AbilityId[];
    readonly enemyHeroes: HeroId[];
    readonly enemyAbilities: AbilityId[];
}

import HeroId from "data/HeroId";

export default interface GuideHeroTagDto {
    readonly playerHeroes: HeroId[];
    readonly allyHeroes: HeroId[];
    readonly enemyHeroes: HeroId[];
}

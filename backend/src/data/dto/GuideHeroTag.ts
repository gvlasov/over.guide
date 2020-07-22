import HeroIds from "data/HeroIds";

export default interface GuideHeroTag {
    readonly playerHeroes: HeroIds[];
    readonly allyHeroes: HeroIds[];
    readonly enemyHeroes: HeroIds[];
}

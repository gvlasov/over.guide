import Hero from "src/data/dto/Hero";

export default interface GuideHeroTag {
    readonly playerHeroes: Hero[];
    readonly allyHeroes: Hero[];
    readonly enemyHeroes: Hero[];
}

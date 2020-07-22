import GuideTheme from "data/GuideTheme";
import Map from "data/Map"
import GuideHeroTag from "data/dto/GuideHeroTag";
import HeroIds from "data/HeroIds";

export default interface GuideDescriptor extends GuideHeroTag {
    playerHeroes: HeroIds[];
    allyHeroes: HeroIds[];
    enemyHeroes: HeroIds[];
    thematicTags: GuideTheme[]
    mapTags: Map[]
}

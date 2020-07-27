import GuideTheme from "data/GuideTheme";
import MapId from "data/MapId"
import GuideHeroTagDto from "data/dto/GuideHeroTagDto";
import HeroId from "data/HeroId";

export default interface GuideDescriptorDto extends GuideHeroTagDto {
    playerHeroes: HeroId[];
    allyHeroes: HeroId[];
    enemyHeroes: HeroId[];
    thematicTags: GuideTheme[]
    mapTags: MapId[]
}

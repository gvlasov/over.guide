import GuideTheme from "data/GuideTheme";
import MapId from "data/MapId"
import GuideHeroTagDto from "data/dto/GuideHeroTagDto";
import HeroId from "data/HeroId";
import AbilityId from "data/AbilityId";

export default interface GuideDescriptorDto extends GuideHeroTagDto {
    playerHeroes: HeroId[];
    teammateHeroes: HeroId[];
    enemyHeroes: HeroId[];
    playerAbilities: AbilityId[];
    teammateAbilities: AbilityId[];
    enemyAbilities: AbilityId[];
    thematicTags: GuideTheme[]
    mapTags: MapId[]
}

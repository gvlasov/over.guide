import GuideDescriptorDto from "data/dto/GuideDescriptorDto";
import HeroId from "data/HeroId";
import MapId from "data/MapId";
import GuideTheme from "data/GuideTheme";
import AbilityId from "data/AbilityId";
export default class GuideDescriptorQuickie implements GuideDescriptorDto {
    playerHeroes: HeroId[];
    playerAbilities: AbilityId[];
    teammateHeroes: HeroId[];
    teammateAbilities: AbilityId[];
    enemyHeroes: HeroId[];
    enemyAbilities: AbilityId[];
    mapTags: MapId[];
    thematicTags: GuideTheme[];
    exact: boolean;
    constructor(dto: {
        playerHeroes?: HeroId[];
        playerAbilities?: AbilityId[];
        teammateHeroes?: HeroId[];
        teammateAbilities?: AbilityId[];
        enemyHeroes?: HeroId[];
        enemyAbilities?: AbilityId[];
        mapTags?: MapId[];
        thematicTags?: GuideTheme[];
        exact?: boolean;
    });
}

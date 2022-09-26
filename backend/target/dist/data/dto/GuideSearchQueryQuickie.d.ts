import HeroId from "data/HeroId";
import MapId from "data/MapId";
import GuideTheme from "data/GuideTheme";
import AbilityId from "data/AbilityId";
import GuideSearchQueryDto from "data/dto/GuideSearchQueryDto";
export default class GuideSearchQueryQuickie implements GuideSearchQueryDto {
    playerHeroes: HeroId[];
    playerAbilities: AbilityId[];
    teammateHeroes: HeroId[];
    teammateAbilities: AbilityId[];
    enemyHeroes: HeroId[];
    enemyAbilities: AbilityId[];
    mapTags: MapId[];
    thematicTags: GuideTheme[];
    clientAlreadyHasGuideIds: number[];
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
        clientAlreadyHasGuideIds?: number[];
        exact?: boolean;
    });
}

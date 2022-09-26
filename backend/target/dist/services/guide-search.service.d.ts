import GuideSearchPageDto from "data/dto/GuideSearchPageDto";
import { GuideDescriptorService } from "src/services/guide-descriptor.service";
import GuideSearchQueryDto from "data/dto/GuideSearchQueryDto";
import HeroId from "data/HeroId";
import MapId from "data/MapId";
import GuideTheme from "data/GuideTheme";
import AbilityId from "data/AbilityId";
import { Sequelize } from "sequelize-typescript";
import GuideSearchByAuthorQuery from "data/dto/GuideSearchByAuthorQuery";
export declare class GuideSearchQuery implements GuideSearchQueryDto {
    playerHeroes: HeroId[];
    playerAbilities: AbilityId[];
    teammateHeroes: HeroId[];
    teammateAbilities: AbilityId[];
    enemyHeroes: HeroId[];
    enemyAbilities: AbilityId[];
    abilities: AbilityId[];
    mapTags: MapId[];
    thematicTags: GuideTheme[];
    user: number;
    clientAlreadyHasGuideIds: number[];
    exact: boolean;
}
export declare class GuideSearchService {
    private readonly sequelize;
    private readonly guideDescriptorService;
    private static pageSize;
    constructor(sequelize: Sequelize, guideDescriptorService: GuideDescriptorService);
    search(query: GuideSearchQuery): Promise<GuideSearchPageDto>;
    private getDescriptorIds;
    searchByAuthor(query: GuideSearchByAuthorQuery): Promise<GuideSearchPageDto>;
}

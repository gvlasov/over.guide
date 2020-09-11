import HeroId from "data/HeroId";
import MapId from "data/MapId";
import GuideTheme from "data/GuideTheme";
import AbilityId from "data/AbilityId";
import GuideSearchQueryDto from "data/dto/GuideSearchQueryDto";

export default class GuideSearchQueryQuickie implements GuideSearchQueryDto {
    public playerHeroes: HeroId[] = [];
    public playerAbilities: AbilityId[] = [];
    public teammateHeroes: HeroId[] = [];
    public teammateAbilities: AbilityId[] = [];
    public enemyHeroes: HeroId[] = [];
    public enemyAbilities: AbilityId[] = [];
    public mapTags: MapId[] = [];
    public thematicTags: GuideTheme[] = [];
    public pageNumber: number = 0;
    public clientAlreadyHasGuideIds: number[] = [];

    constructor(
        dto: {
            playerHeroes?: HeroId[],
            playerAbilities?: AbilityId[]
            teammateHeroes?: HeroId[],
            teammateAbilities?: AbilityId[],
            enemyHeroes?: HeroId[],
            enemyAbilities?: AbilityId[],
            mapTags?: MapId[],
            thematicTags?: GuideTheme[],
            pageNumber?: number,
            clientAlreadyHasGuideIds?: number[]
        }
    ) {
        this.playerHeroes = dto.playerHeroes || [];
        this.playerAbilities = dto.playerAbilities || [];
        this.teammateHeroes = dto.teammateHeroes || [];
        this.teammateAbilities = dto.teammateAbilities || [];
        this.enemyHeroes = dto.enemyHeroes || [];
        this.enemyAbilities = dto.enemyAbilities || [];
        this.mapTags = dto.mapTags || [];
        this.thematicTags = dto.thematicTags || [];
        this.pageNumber = dto.pageNumber || 0;
        this.clientAlreadyHasGuideIds = dto.clientAlreadyHasGuideIds || [];
    }

}

import GuideDescriptorDto from "data/dto/GuideDescriptorDto";
import HeroId from "data/HeroId";
import MapId from "data/MapId";
import GuideTheme from "data/GuideTheme";
import AbilityId from "data/AbilityId";

export default class GuideDescriptorQuickie implements GuideDescriptorDto {
    public playerHeroes: HeroId[] = [];
    public playerAbilities: AbilityId[] = [];
    public teammateHeroes: HeroId[] = [];
    public teammateAbilities: AbilityId[] = [];
    public enemyHeroes: HeroId[] = [];
    public enemyAbilities: AbilityId[] = [];
    public mapTags: MapId[] = [];
    public thematicTags: GuideTheme[] = [];

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
    }

}

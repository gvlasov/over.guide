import GuideDescriptorDto from "data/dto/GuideDescriptorDto";
import HeroId from "data/HeroId";
import MapId from "data/MapId";
import GuideTheme from "data/GuideTheme";
import AbilityId from "data/AbilityId";

export default class GuideDescriptorQuickie implements GuideDescriptorDto {
    public playerHeroes: HeroId[] = [];
    public playerAbilities: AbilityId[] = [];
    public allyHeroes: HeroId[] = [];
    public allyAbilities: AbilityId[] = [];
    public enemyHeroes: HeroId[] = [];
    public enemyAbilities: AbilityId[] = [];
    public mapTags: MapId[] = [];
    public thematicTags: GuideTheme[] = [];
    public abilities: AbilityId[] = [];

    constructor(
        dto: {
            playerHeroes?: HeroId[],
            playerAbilities?: AbilityId[]
            allyHeroes?: HeroId[],
            allyAbilities?: AbilityId[],
            enemyHeroes?: HeroId[],
            enemyAbilities?: AbilityId[],
            mapTags?: MapId[],
            thematicTags?: GuideTheme[],
            abilities?: AbilityId[]
        }
    ) {
        this.playerHeroes = dto.playerHeroes || [];
        this.playerAbilities = dto.playerAbilities || [];
        this.allyHeroes = dto.allyHeroes || [];
        this.allyAbilities = dto.allyAbilities || [];
        this.enemyHeroes = dto.enemyHeroes || [];
        this.enemyAbilities = dto.enemyAbilities || [];
        this.mapTags = dto.mapTags || [];
        this.thematicTags = dto.thematicTags || [];
        this.abilities = dto.abilities || [];
    }

}

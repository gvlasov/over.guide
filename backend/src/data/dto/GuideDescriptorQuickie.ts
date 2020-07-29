import GuideDescriptorDto from "data/dto/GuideDescriptorDto";
import HeroId from "data/HeroId";
import MapId from "data/MapId";
import GuideTheme from "data/GuideTheme";
import AbilityId from "data/AbilityId";

export default class GuideDescriptorQuickie implements GuideDescriptorDto {
    public playerHeroes: HeroId[] = [];
    public allyHeroes: HeroId[] = [];
    public enemyHeroes: HeroId[] = [];
    public mapTags: MapId[] = [];
    public thematicTags: GuideTheme[] = [];
    public abilities: AbilityId[] = [];

    constructor(
        dto: {
            playerHeroes?: HeroId[],
            allyHeroes?: HeroId[],
            enemyHeroes?: HeroId[],
            mapTags?: MapId[],
            thematicTags?: GuideTheme[],
            abilities?: AbilityId[]
        }
    ) {
        this.playerHeroes = dto.playerHeroes || [];
        this.allyHeroes = dto.allyHeroes || [];
        this.enemyHeroes = dto.enemyHeroes || [];
        this.mapTags = dto.mapTags || [];
        this.thematicTags = dto.thematicTags || [];
        this.abilities = dto.abilities || [];
    }

}

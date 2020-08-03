import GuideDescriptorDto from "data/dto/GuideDescriptorDto";
import heroes from 'data/heroes'
import maps from 'data/maps'
import thematicTags from 'data/thematicTags'
import abilities from 'data/abilities'
import MapDto from "data/dto/MapDto";
import ThematicTagDto from "data/dto/ThematicTagDto";
import TagGroupVso from "@/js/vso/TagGroupVso";
import AbilityVso from "@/js/vso/AbilityVso";

export default class GuideDescriptorVso {

    public players: TagGroupVso;
    public allies: TagGroupVso;
    public enemies: TagGroupVso;
    public maps: MapDto[];
    public thematicTags: ThematicTagDto[];

    constructor(descriptor: GuideDescriptorDto) {
        const allHeroes = Array.from(heroes.values())
        const allMaps = Array.from(maps.values())
        const allThematicTags = Array.from(thematicTags.values())
        const allAbilities = Array.from(abilities.values())
        this.players = new TagGroupVso(
            allHeroes.filter(hero => descriptor.playerHeroes.includes(hero.id)),
            allAbilities
                .filter(ability => descriptor.playerAbilities.includes(ability.id))
                .map(it => new AbilityVso(it)),
        );
        this.allies = new TagGroupVso(
            allHeroes.filter(hero => descriptor.allyHeroes.includes(hero.id)),
            allAbilities
                .filter(ability => descriptor.allyAbilities.includes(ability.id))
                .map(it => new AbilityVso(it)),
        );
        this.enemies = new TagGroupVso(
            allHeroes
                .filter(hero => descriptor.enemyHeroes.includes(hero.id)),
            allAbilities
                .filter(ability => descriptor.enemyAbilities.includes(ability.id))
                .map(it => new AbilityVso(it)),
        );
        this.maps = allMaps.filter(map => descriptor.mapTags.includes(map.id))
        this.thematicTags = allThematicTags.filter(tag => descriptor.thematicTags.includes(tag.id))
    }

}

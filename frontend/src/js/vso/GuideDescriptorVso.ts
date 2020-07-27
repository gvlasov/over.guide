import GuideDescriptorDto from "data/dto/GuideDescriptorDto";
import heroes from 'data/heroes'
import maps from 'data/maps'
import thematicTags from 'data/thematicTags'
import HeroDto from "data/dto/HeroDto";
import MapDto from "data/dto/MapDto";
import ThematicTagDto from "data/dto/ThematicTagDto";

export default class GuideDescriptorVso {

    public playerHeroes: HeroDto[];
    public allyHeroes: HeroDto[];
    public enemyHeroes: HeroDto[];
    public maps: MapDto[];
    public thematicTags: ThematicTagDto[];

    constructor(descriptor: GuideDescriptorDto) {
        const allHeroes = Array.from(heroes.values())
        const allMaps = Array.from(maps.values())
        const allThematicTags = Array.from(thematicTags.values())
        this.playerHeroes = allHeroes.filter(hero => descriptor.playerHeroes.includes(hero.id))
        this.allyHeroes = allHeroes.filter(hero => descriptor.allyHeroes.includes(hero.id))
        this.enemyHeroes = allHeroes.filter(hero => descriptor.enemyHeroes.includes(hero.id))
        this.maps = allMaps.filter(map => descriptor.mapTags.includes(map.id))
        this.thematicTags = allThematicTags.filter(tag => descriptor.thematicTags.includes(tag.id))
    }

}

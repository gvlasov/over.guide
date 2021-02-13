import HeroId from "data/HeroId";
import AbilityId from "data/AbilityId";
import GuideTheme from "data/GuideTheme";
import MapId from "data/MapId";
import GuideDescriptorDto from "data/dto/GuideDescriptorDto";
import heroes from "data/heroes";
import HeroDto from "data/dto/HeroDto";
import AbilityDto from "data/dto/AbilityDto";
import ThematicTagDto from "data/dto/ThematicTagDto";
import MapDto from "data/dto/MapDto";
import abilities from "data/abilities";
import thematicTags from "data/thematicTags";
import maps from "data/maps";

export class DescriptorGroup<T extends number, Dto extends {id: T}> {

    static readonly PlayerHeroes =
        new DescriptorGroup<HeroId, HeroDto>(0, 'playerHeroes', heroes)
    static readonly TeammateHeroes =
        new DescriptorGroup<HeroId, HeroDto>(1, 'teammateHeroes', heroes)
    static readonly EnemyHeroes =
        new DescriptorGroup<HeroId, HeroDto>(2, 'enemyHeroes', heroes)
    static readonly PlayerAbilities =
        new DescriptorGroup<AbilityId, AbilityDto>(3, 'playerAbilities', abilities)
    static readonly TeammateAbilities =
        new DescriptorGroup<AbilityId, AbilityDto>(4, 'teammateAbilities', abilities)
    static readonly EnemyAbilities =
        new DescriptorGroup<AbilityId, AbilityDto>(5, 'enemyAbilities', abilities)
    static readonly ThematicTags =
        new DescriptorGroup<GuideTheme, ThematicTagDto>(6, 'thematicTags', thematicTags)
    static readonly MapTags =
        new DescriptorGroup<MapId, MapDto>(7, 'mapTags', maps)

    protected constructor(
        readonly id: number,
        readonly name: DescriptorGroupName,
        readonly data: Map<T, Dto>
    ) {
    }

    valuesOf(query: GuideDescriptorDto): T[] {
        return query[this.name] as T[]
    }

    static get values(): DescriptorGroup<any, any>[] {
        return Object.values(DescriptorGroup)
    }

    get ids(): T[] {
        return Array.from(this.data.values()).map(it => it.id)
    }

}

export type DescriptorGroupName = keyof GuideDescriptorDto

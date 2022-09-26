import HeroId from "data/HeroId";
import AbilityId from "data/AbilityId";
import GuideTheme from "data/GuideTheme";
import MapId from "data/MapId";
import GuideDescriptorDto from "data/dto/GuideDescriptorDto";
import HeroDto from "data/dto/HeroDto";
import AbilityDto from "data/dto/AbilityDto";
import ThematicTagDto from "data/dto/ThematicTagDto";
import MapDto from "data/dto/MapDto";
export declare class DescriptorGroup<T extends number, Dto extends {
    id: T;
}> {
    readonly id: number;
    readonly name: DescriptorGroupName;
    readonly data: Map<T, Dto>;
    static readonly PlayerHeroes: DescriptorGroup<HeroId, HeroDto>;
    static readonly TeammateHeroes: DescriptorGroup<HeroId, HeroDto>;
    static readonly EnemyHeroes: DescriptorGroup<HeroId, HeroDto>;
    static readonly PlayerAbilities: DescriptorGroup<AbilityId, AbilityDto>;
    static readonly TeammateAbilities: DescriptorGroup<AbilityId, AbilityDto>;
    static readonly EnemyAbilities: DescriptorGroup<AbilityId, AbilityDto>;
    static readonly ThematicTags: DescriptorGroup<GuideTheme, ThematicTagDto>;
    static readonly MapTags: DescriptorGroup<MapId, MapDto>;
    protected constructor(id: number, name: DescriptorGroupName, data: Map<T, Dto>);
    valuesOf(query: GuideDescriptorDto): T[];
    static get values(): DescriptorGroup<any, any>[];
    get ids(): T[];
}
export declare type DescriptorGroupName = keyof GuideDescriptorDto;

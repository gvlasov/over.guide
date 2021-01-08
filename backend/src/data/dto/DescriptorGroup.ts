import HeroId from "data/HeroId";
import AbilityId from "data/AbilityId";
import GuideTheme from "data/GuideTheme";
import MapId from "data/MapId";
import GuideDescriptorDto from "data/dto/GuideDescriptorDto";

export class DescriptorGroup<T> {

    static readonly PlayerHeroes =
        new DescriptorGroup<HeroId>(0, 'playerHeroes')
    static readonly TeammateHeroes =
        new DescriptorGroup<HeroId>(1, 'teammateHeroes')
    static readonly EnemyHeroes =
        new DescriptorGroup<HeroId>(2, 'enemyHeroes')
    static readonly PlayerAbilities =
        new DescriptorGroup<AbilityId>(3, 'playerAbilities')
    static readonly TeammateAbilities =
        new DescriptorGroup<AbilityId>(4, 'teammateAbilities')
    static readonly EnemyAbilities =
        new DescriptorGroup<AbilityId>(5, 'enemyAbilities')
    static readonly ThematicTags =
        new DescriptorGroup<GuideTheme>(6, 'thematicTags')
    static readonly MapTags =
        new DescriptorGroup<MapId>(7, 'mapTags')

    protected constructor(
        readonly id: number,
        readonly name: DescriptorGroupName
    ) {
    }

    valuesOf(query: GuideDescriptorDto) {
        return query[this.name]
    }

    static get values(): DescriptorGroup<any>[] {
        return Object.values(DescriptorGroup)
    }

}

export type DescriptorGroupName = keyof GuideDescriptorDto

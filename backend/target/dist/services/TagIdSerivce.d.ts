import { DescriptorGroup } from "data/dto/DescriptorGroup";
import HeroId from "data/HeroId";
import AbilityId from "data/AbilityId";
import MapId from "data/MapId";
import GuideTheme from "data/GuideTheme";
declare type Tag = (HeroId | AbilityId | MapId | GuideTheme);
export default class TagIdService {
    private readonly storage;
    constructor();
    getTagId<T extends Tag>(group: DescriptorGroup<T, any>, tagId: T): number;
}
export {};

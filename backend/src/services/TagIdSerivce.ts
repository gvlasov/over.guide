import {Injectable} from '@nestjs/common';
import {DescriptorGroup} from "data/dto/DescriptorGroup";
import HeroId from "data/HeroId";
import AbilityId from "data/AbilityId";
import MapId from "data/MapId";
import GuideTheme from "data/GuideTheme";

type Tag = (HeroId | AbilityId | MapId | GuideTheme)

type Storage = {
    [key: number]: {
        [key: number]: number
    }
}

@Injectable()
export default class TagIdService {
    private readonly storage: Storage = {}

    constructor() {
        let i = 0;
        for (const group of DescriptorGroup.values) {
            const groupTags = {}
            for (const tag of group.ids) {
                groupTags[tag] = i
                i++
            }
            this.storage[group.id] = groupTags
        }
    }

    getTagId<T extends Tag>(
        group: DescriptorGroup<T, any>,
        tagId: T
    ): number {
        return this.storage[group.id][tagId]
    }

}


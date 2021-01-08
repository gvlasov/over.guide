import {Injectable} from '@nestjs/common';
import GuideDescriptorDto from "data/dto/GuideDescriptorDto";
import {DescriptorGroup} from "data/dto/DescriptorGroup";
import GuideSearchQueryDto from "data/dto/GuideSearchQueryDto";

type CacheLevel<T> = {
    subnodes: Map<string, CacheLevel<T>> | null,
    pages: PageBranch<T>
}

type PageBranch<T> = {
    [key in number]: {
        exact?: T,
        nonExact?: T
    }
}


function hash(group: DescriptorGroup<any>, value: number) {
    return group.id + "_" + value
}

function pageBranchKey(query: GuideSearchQueryDto): number {
    let hash = 0;
    for (let id of query.clientAlreadyHasGuideIds) {
        // https://stackoverflow.com/a/2285861/1542343
        hash = (hash + (324723947 + id)) ^ 93485734985;
    }
    return hash
}


@Injectable()
export default class GuideSearchCacheService<T> {

    private root: CacheLevel<T> = {
        subnodes: new Map(),
        pages: {},
    }

    constructor() {
    }

    set(
        query: GuideSearchQueryDto,
        value: T
    ) {
        const key = pageBranchKey(query);
        const node = this.obtainNode(query);
        let page = node.pages[key]
        if (page === undefined) {
            node.pages[key] = page = {}
        }
        page[query.exact ? 'exact' : 'nonExact'] = value
    }

    clear(descriptor: GuideDescriptorDto): void {
        const node = this.obtainNode(descriptor);
        if (node !== null) {
            node.pages = {}
            node.subnodes = new Map()
        }
    }

    get(
        query: GuideSearchQueryDto
    ): T | null {
        let peak = this.root
        for (let group of DescriptorGroup.values) {
            for (
                let component
                of group.valuesOf(query).sort((a, b) => b - a)
                ) {
                peak = peak.subnodes.get(
                    hash(group, component)
                )
                if (peak === undefined) {
                    return null;
                }
            }
        }
        return peak.pages?.[pageBranchKey(query)]?.[query.exact ? 'exact' : 'nonExact'] ?? null
    }

    async getOrSet(
        query: GuideSearchQueryDto,
        obtainer: () => Promise<T>
    ): Promise<T> {
        const existing = this.get(query)
        if (existing !== null) {
            return existing
        }
        const value = await obtainer()
        this.set(query, value)
        return value
    }

    private obtainNode(query: GuideDescriptorDto): CacheLevel<T> {
        let peak = this.root
        for (let group of DescriptorGroup.values) {
            for (
                let value of
                group.valuesOf(query).sort((a, b) => b - a)
                ) {
                let previousPeak = peak
                const key = hash(group, value);
                peak = peak.subnodes.get(key)
                if (peak === undefined) {
                    peak =
                        {
                            subnodes: new Map(),
                            pages: {}
                        }
                    previousPeak.subnodes.set(
                        key,
                        peak
                    )
                }
            }
        }
        return peak
    }

}


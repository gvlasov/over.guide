import {Injectable} from '@nestjs/common';
import GuideDescriptorDto from "data/dto/GuideDescriptorDto";
import {DescriptorGroup} from "data/dto/DescriptorGroup";
import GuideDescriptorQuickie from "data/dto/GuideDescriptorQuickie";

type CacheLevel<T> = {
    subnodes: Map<string, CacheLevel<T>> | null,
    value: T | null
}


function hash(group: DescriptorGroup<any>, value: number) {
    return group.id + "_" + value
}


@Injectable()
export default class GuideSearchCacheService<T> {

    private root: CacheLevel<T> = {
        subnodes: new Map(),
        value: null,
    }

    constructor() {
    }

    set(
        descriptor: GuideDescriptorDto,
        page: T
    ) {
        this.obtainNode(descriptor).value = page
    }

    clear(descriptor: GuideDescriptorDto): void {
        const node = this.obtainNode(descriptor);
        if (node !== null) {
            node.value = null
            node.subnodes = new Map()
        }
    }

    get(
        descriptor: GuideDescriptorDto
    ): T | null {
        let peak = this.root
        for (let group of DescriptorGroup.values) {
            for (
                let component
                of group.valuesOf(descriptor).sort((a, b) => b - a)
                ) {
                peak = peak.subnodes.get(
                    hash(group, component)
                )
                if (peak === undefined) {
                    return null;
                }
            }
        }
        return peak.value
    }

    getAll(): T | null {
        return this.get(
            new GuideDescriptorQuickie({})
        )
    }

    private obtainNode(descriptor: GuideDescriptorDto): CacheLevel<T> {
        let peak = this.root
        for (let group of DescriptorGroup.values) {
            for (
                let value of
                group.valuesOf(descriptor).sort((a, b) => b - a)
                ) {
                let previousPeak = peak
                const key = hash(group, value);
                peak = peak.subnodes.get(key)
                if (peak === undefined) {
                    peak =
                        {
                            subnodes: new Map(),
                            value: null
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


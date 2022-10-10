import {Injectable} from '@nestjs/common';
import GuideDescriptorDto from "data/dto/GuideDescriptorDto";
import {DescriptorGroup} from "data/dto/DescriptorGroup";
import GuideSearchQueryDto from "data/dto/GuideSearchQueryDto";
import TagIdService from "src/services/TagIdSerivce";
import GuideDescriptorQuickie from "data/dto/GuideDescriptorQuickie";
import _ from "lodash";
import GuideSearchPageDto from "data/dto/GuideSearchPageDto";

type Node<T> = {
    upper: Node<T>[],
    lower: Node<T>[],
    key: GuideDescriptorDto,
    keyHash: number,
    createdAtMs: number,
    pages: Map<number, T>
}


/**
 @see https://stackoverflow.com/a/2285861/1542343
 */
function coolHash(list: number[]) {
    let hash = 0;
    for (const id of list) {
        hash = (hash + (324723947 + id)) ^ 93485734985;
    }
    return hash
}


function pagePositionHash(query: GuideSearchQueryDto): number {
    return coolHash([query.exact ? 1 : 0, ...query.clientAlreadyHasGuideIds])
}

type T = GuideSearchPageDto

@Injectable()
export default class SearchCacheService {

    private root: Node<T> = {
        upper: [],
        lower: [],
        key: new GuideDescriptorQuickie({}),
        pages: new Map(),
        createdAtMs: (new Date()).getTime(),
        keyHash: this.nodeKeyHash(new GuideDescriptorQuickie({})),
    }

    private nodesMap: Map<number, Node<T>> = new Map<number, Node<T>>(
        [[this.root.keyHash, this.root]]
    )

    private liveTimeMs: number = 3 * 24 * 3600 * 1000 // 3 days

    constructor(
        private readonly tagIdService: TagIdService
    ) {
    }

    set(
        query: GuideSearchQueryDto,
        value: T
    ): void {
        this.obtainNode(query).pages.set(
            pagePositionHash(query),
            value
        )
    }

    private obtainNode(query: GuideDescriptorDto): Node<T> {
        const keyHash = this.nodeKeyHash(query);
        const existingNode =
            this.nodesMap.get(keyHash)
        if (existingNode !== void 0) {
            console.log('found existing node for key hash', keyHash)
            return existingNode
        }
        console.log('inserting for key hash', keyHash)

        // Find deepest nodes whose descriptors are subsets of query
        let nodes = [this.root]
        const terminalNodes = new Set<Node<T>>()
        do {
            const newNodes = new Set<Node<T>>()
            for (const node of nodes) {
                let hasFurtherSubsets = false
                for (const lower of node.lower) {
                    if (this.isSubsetOf(lower.key, query)) {
                        newNodes.add(lower)
                        hasFurtherSubsets = true
                    }
                }
                if (!hasFurtherSubsets) {
                    terminalNodes.add(node)
                }
            }
            nodes = Array.from(newNodes.values())
        } while (nodes.length > 0)
        // Insertion
        const newUpper = Array.from(terminalNodes.values());
        const newNode: Node<T> = {
            upper: newUpper,
            lower:
                Array.from(
                    new Set(
                        newUpper
                            .flatMap(terminal => terminal.lower)
                    )
                        .values()
                ),
            key: query,
            pages: new Map(),
            createdAtMs: (new Date()).getTime(),
            keyHash: keyHash,
        }
        this.nodesMap.set(keyHash, newNode)
        return newNode
    }

    private insertBetween(upper: Node<T>, insert: Node<T>, lower: Node<T>) {
        for (const i in upper.lower) {
            if (upper.lower[i] === lower) {
                upper[i] = insert
                for (const j in lower.upper) {
                    if (lower.upper[j] === upper) {
                        lower.upper[j] = insert
                        return
                    }
                }
                break
            }
        }
        throw new Error('Nodes are not linked')
    }

    private nodeKeyHash(key: GuideDescriptorDto): number {
        return coolHash(
            DescriptorGroup.values
                .map(group => {
                    return group
                        .valuesOf(key)
                        .sort()
                        .map(tag => this.tagIdService.getTagId(group, tag))
                })
                .reduce(
                    (prev, curr) => [...prev, ...curr],
                    []
                )
        )
    }

    private isSubsetOf(
        subset: GuideDescriptorDto,
        superset: GuideDescriptorDto
    ): boolean {
        return DescriptorGroup.values.every(group => {
            return _.difference(
                group.valuesOf(subset) as number[],
                group.valuesOf(superset)
            ).length === 0
        })
    }

    clear(key: GuideDescriptorDto): void {
        const removed = this.obtainNode(key)
        let nodes: Node<T>[] = [removed]
        let i = 0;
        do {
            const nextNodes: Node<T>[] = []
            for (const node of nodes) {
                nextNodes.push(...node.upper)
                if (node.lower.length === 0 && node !== this.root) {
                    this.removeTerminalNode(node)
                } else {
                    console.log('clearing', node.keyHash)
                    console.log('   has', node.upper.length, 'upper')
                    node.pages = new Map()
                }
            }
            if (nextNodes.length === 0) {
                break;
            }
            nodes = nextNodes
            if (i++ > 100) {
                throw new Error('wtf bug')
            }
        } while (true)
    }

    private removeTerminalNode(node: Node<T>) {
        console.log('removing node', node.keyHash)
        if (node.lower.length > 0) {
            throw new Error('Not a terminal node')
        }
        this.nodesMap.delete(node.keyHash)
        for (const upper of node.upper) {
            upper.lower.splice(upper.lower.indexOf(node), 1)
        }
    }

    get(
        query: GuideSearchQueryDto
    ): T | undefined {
        const node = this.nodesMap
            .get(this.nodeKeyHash(query));
        if (
            node === void 0
        ) {
            return undefined
        }
        if (node.createdAtMs < new Date().getTime() - this.liveTimeMs) {
            node.pages = new Map()
            return undefined
        }
        return node
            .pages
            .get(pagePositionHash(query))
    }

    async getOrSet(
        query: GuideSearchQueryDto,
        obtainer: () => Promise<T>
    ): Promise<T> {
        const existing = this.get(query)
        if (existing !== void 0) {
            console.log('cache hit for', this.nodeKeyHash(query))
            return existing
        }
        console.log('cache miss for', this.nodeKeyHash(query))
        const value = await obtainer()
        this.set(query, value)
        return value
    }

}


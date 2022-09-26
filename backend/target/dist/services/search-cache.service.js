"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const GuideDescriptorDto_1 = __importDefault(require("../data/dto/GuideDescriptorDto"));
const DescriptorGroup_1 = require("../data/dto/DescriptorGroup");
const GuideSearchQueryDto_1 = __importDefault(require("../data/dto/GuideSearchQueryDto"));
const TagIdSerivce_1 = __importDefault(require("./TagIdSerivce"));
const GuideDescriptorQuickie_1 = __importDefault(require("../data/dto/GuideDescriptorQuickie"));
const lodash_1 = __importDefault(require("lodash"));
const GuideSearchPageDto_1 = __importDefault(require("../data/dto/GuideSearchPageDto"));
function coolHash(list) {
    let hash = 0;
    for (const id of list) {
        hash = (hash + (324723947 + id)) ^ 93485734985;
    }
    return hash;
}
function pagePositionHash(query) {
    return coolHash([query.exact ? 1 : 0, ...query.clientAlreadyHasGuideIds]);
}
let SearchCacheService = class SearchCacheService {
    constructor(tagIdService) {
        this.tagIdService = tagIdService;
        this.root = {
            upper: [],
            lower: [],
            key: new GuideDescriptorQuickie_1.default({}),
            pages: new Map(),
            createdAtMs: (new Date()).getTime(),
            keyHash: this.nodeKeyHash(new GuideDescriptorQuickie_1.default({})),
        };
        this.nodesMap = new Map([[this.root.keyHash, this.root]]);
        this.liveTimeMs = 3 * 24 * 3600 * 1000;
    }
    set(query, value) {
        this.obtainNode(query).pages.set(pagePositionHash(query), value);
    }
    obtainNode(query) {
        const keyHash = this.nodeKeyHash(query);
        const existingNode = this.nodesMap.get(keyHash);
        if (existingNode !== void 0) {
            console.log('found existing node for key hash', keyHash);
            return existingNode;
        }
        console.log('inserting for key hash', keyHash);
        let nodes = [this.root];
        const terminalNodes = new Set();
        do {
            const newNodes = new Set();
            for (const node of nodes) {
                let hasFurtherSubsets = false;
                for (const lower of node.lower) {
                    if (this.isSubsetOf(lower.key, query)) {
                        newNodes.add(lower);
                        hasFurtherSubsets = true;
                    }
                }
                if (!hasFurtherSubsets) {
                    terminalNodes.add(node);
                }
            }
            nodes = Array.from(newNodes.values());
        } while (nodes.length > 0);
        const newUpper = Array.from(terminalNodes.values());
        const newNode = {
            upper: newUpper,
            lower: Array.from(new Set(newUpper
                .flatMap(terminal => terminal.lower))
                .values()),
            key: query,
            pages: new Map(),
            createdAtMs: (new Date()).getTime(),
            keyHash: keyHash,
        };
        this.nodesMap.set(keyHash, newNode);
        return newNode;
    }
    insertBetween(upper, insert, lower) {
        for (const i in upper.lower) {
            if (upper.lower[i] === lower) {
                upper[i] = insert;
                for (const j in lower.upper) {
                    if (lower.upper[j] === upper) {
                        lower.upper[j] = insert;
                        return;
                    }
                }
                break;
            }
        }
        throw new Error('Nodes are not linked');
    }
    nodeKeyHash(key) {
        return coolHash(DescriptorGroup_1.DescriptorGroup.values
            .map(group => {
            return group
                .valuesOf(key)
                .sort()
                .map(tag => this.tagIdService.getTagId(group, tag));
        })
            .reduce((prev, curr) => [...prev, ...curr], []));
    }
    isSubsetOf(subset, superset) {
        return DescriptorGroup_1.DescriptorGroup.values.every(group => {
            return lodash_1.default.difference(group.valuesOf(subset), group.valuesOf(superset)).length === 0;
        });
    }
    clear(key) {
        const removed = this.nodesMap.get(this.nodeKeyHash(key));
        if (removed === undefined) {
            return;
        }
        let nodes = [removed];
        let i = 0;
        do {
            const nextNodes = [];
            for (const node of nodes) {
                nextNodes.push(...node.upper);
                if (node.lower.length === 0 && node !== this.root) {
                    this.removeTerminalNode(node);
                }
                else {
                    console.log('clearing', node.keyHash);
                    console.log('   has', node.upper.length, 'upper');
                    node.pages = new Map();
                }
            }
            if (nextNodes.length === 0) {
                break;
            }
            nodes = nextNodes;
            if (i++ > 100) {
                throw new Error('wtf bug');
            }
        } while (true);
    }
    removeTerminalNode(node) {
        console.log('removing node', node.keyHash);
        if (node.lower.length > 0) {
            throw new Error('Not a terminal node');
        }
        this.nodesMap.delete(node.keyHash);
        for (const upper of node.upper) {
            upper.lower.splice(upper.lower.indexOf(node), 1);
        }
    }
    get(query) {
        const node = this.nodesMap
            .get(this.nodeKeyHash(query));
        if (node === void 0) {
            return undefined;
        }
        if (node.createdAtMs < new Date().getTime() - this.liveTimeMs) {
            node.pages = new Map();
            return undefined;
        }
        return node
            .pages
            .get(pagePositionHash(query));
    }
    async getOrSet(query, obtainer) {
        const existing = this.get(query);
        if (existing !== void 0) {
            console.log('cache hit for', this.nodeKeyHash(query));
            return existing;
        }
        console.log('cache miss for', this.nodeKeyHash(query));
        const value = await obtainer();
        this.set(query, value);
        return value;
    }
};
SearchCacheService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [TagIdSerivce_1.default])
], SearchCacheService);
exports.default = SearchCacheService;
//# sourceMappingURL=search-cache.service.js.map
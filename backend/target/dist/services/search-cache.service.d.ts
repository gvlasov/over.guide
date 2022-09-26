import GuideDescriptorDto from "data/dto/GuideDescriptorDto";
import GuideSearchQueryDto from "data/dto/GuideSearchQueryDto";
import TagIdService from "src/services/TagIdSerivce";
import GuideSearchPageDto from "data/dto/GuideSearchPageDto";
declare type T = GuideSearchPageDto;
export default class SearchCacheService {
    private readonly tagIdService;
    private root;
    private nodesMap;
    private liveTimeMs;
    constructor(tagIdService: TagIdService);
    set(query: GuideSearchQueryDto, value: T): void;
    private obtainNode;
    private insertBetween;
    private nodeKeyHash;
    private isSubsetOf;
    clear(key: GuideDescriptorDto): void;
    private removeTerminalNode;
    get(query: GuideSearchQueryDto): T | undefined;
    getOrSet(query: GuideSearchQueryDto, obtainer: () => Promise<T>): Promise<T>;
}
export {};

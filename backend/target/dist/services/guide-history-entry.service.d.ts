import { User } from "src/database/models/User";
import { GuideHistoryEntry } from "src/database/models/GuideHistoryEntry";
import { GuideDescriptorService } from "src/services/guide-descriptor.service";
import { Sequelize } from "sequelize-typescript";
import { ContentHashService } from "src/services/content-hash.service";
import GuideHistoryEntryAppendDto from "data/dto/GuideHistoryEntryAppendDto";
import GuideHistoryEntryCreateDto from "data/dto/GuideHistoryEntryCreateDto";
import { RestrictionService } from "src/services/restriction.service";
import SearchCacheService from "src/services/search-cache.service";
import { ThumbnailService } from "src/services/thumbnail.service";
export declare enum SaveResult {
    SavingDuplicateRejected = 0,
    UserBannedFromGuideCreation = 1
}
export declare class GuideHistoryEntryService {
    private readonly guideDescriptorService;
    private readonly contentHashService;
    private readonly sequelize;
    private readonly restrictionService;
    private readonly guideSearchCache;
    private readonly thumbnailService;
    constructor(guideDescriptorService: GuideDescriptorService, contentHashService: ContentHashService, sequelize: Sequelize, restrictionService: RestrictionService, guideSearchCache: SearchCacheService, thumbnailService: ThumbnailService);
    create(gheDto: GuideHistoryEntryCreateDto, saver: User): Promise<GuideHistoryEntry | SaveResult>;
    append(gheDto: GuideHistoryEntryAppendDto, saver: User): Promise<GuideHistoryEntry | SaveResult>;
    private save;
    private static obtainGuidePartText;
    private obtainGuidePartVideo;
}

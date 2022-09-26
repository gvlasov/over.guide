import { AuthService } from "src/services/auth.service";
import { Request, Response } from "express";
import { GuideHistoryEntryService } from "src/services/guide-history-entry.service";
import { ModerationService } from "src/services/moderation.service";
import GuideSearchPageDto from "data/dto/GuideSearchPageDto";
import { GuideSearchQuery, GuideSearchService } from "src/services/guide-search.service";
import GuideHistoryEntryCreateDto from "data/dto/GuideHistoryEntryCreateDto";
import GuideHistoryEntryAppendDto from "data/dto/GuideHistoryEntryAppendDto";
import { ExistingGuideHeadDto } from "data/dto/GuideHeadDto";
import { RestrictionService } from "src/services/restriction.service";
import GuideSearchByAuthorQuery from "data/dto/GuideSearchByAuthorQuery";
import SearchCacheService from "src/services/search-cache.service";
export declare class GuideController {
    private readonly authService;
    private readonly guideHistoryEntryService;
    private readonly moderationService;
    private readonly guideSearchService;
    private readonly restrictionService;
    private readonly guideSearchCache;
    constructor(authService: AuthService, guideHistoryEntryService: GuideHistoryEntryService, moderationService: ModerationService, guideSearchService: GuideSearchService, restrictionService: RestrictionService, guideSearchCache: SearchCacheService);
    get(request: Request, response: Response, id: number): Promise<void>;
    create(response: Response, request: Request, dto: GuideHistoryEntryCreateDto): Promise<void>;
    update(response: Response, request: Request, dto: GuideHistoryEntryAppendDto): Promise<void>;
    deactivate(response: Response, request: Request, target: {
        id: number;
    }): Promise<void>;
    activate(response: Response, request: Request, target: {
        id: number;
    }): Promise<void>;
    searchPost(query: GuideSearchQuery): Promise<GuideSearchPageDto>;
    searchByVideo(videoId: string): Promise<ExistingGuideHeadDto[]>;
    searchByAuthor(query: GuideSearchByAuthorQuery, response: Response): Promise<void>;
}

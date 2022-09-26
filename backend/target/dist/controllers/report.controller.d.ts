import { AuthService } from "src/services/auth.service";
import { Request, Response } from "express";
import { GuideHistoryEntryService } from "src/services/guide-history-entry.service";
import ReportDto from "data/dto/ReportDto";
import { Report } from "src/database/models/Report";
import { RightsService } from "src/services/rights.service";
import ReportQueryDto from "data/dto/ReportQueryDto";
import { ReportSearchService } from "src/services/report-search.service";
import { RestrictionService } from "src/services/restriction.service";
export declare class ReportController {
    private readonly authService;
    private readonly guideHistoryEntryService;
    private readonly rightsService;
    private readonly reportSearchService;
    private readonly restrictionService;
    constructor(authService: AuthService, guideHistoryEntryService: GuideHistoryEntryService, rightsService: RightsService, reportSearchService: ReportSearchService, restrictionService: RestrictionService);
    search(response: Response, dto: ReportQueryDto): Promise<void>;
    test(): Promise<Report[]>;
    create(request: Request, response: Response, dto: ReportDto): Promise<void>;
    handle(reportId: number): Promise<[number, Report[]]>;
}

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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../services/auth.service");
const authenticated_guard_1 = require("../services/authenticated.guard");
const guide_history_entry_service_1 = require("../services/guide-history-entry.service");
const ReportDto_1 = __importDefault(require("../data/dto/ReportDto"));
const Report_1 = require("../database/models/Report");
const rights_service_1 = require("../services/rights.service");
const ReportQueryDto_1 = __importDefault(require("../data/dto/ReportQueryDto"));
const report_search_service_1 = require("../services/report-search.service");
const moderator_guard_1 = require("../services/moderator.guard");
const restriction_service_1 = require("../services/restriction.service");
const RestrictionTypeId_1 = __importDefault(require("../data/RestrictionTypeId"));
const ApiErrorId_1 = __importDefault(require("../data/ApiErrorId"));
const User_1 = require("../database/models/User");
let ReportController = class ReportController {
    constructor(authService, guideHistoryEntryService, rightsService, reportSearchService, restrictionService) {
        this.authService = authService;
        this.guideHistoryEntryService = guideHistoryEntryService;
        this.rightsService = rightsService;
        this.reportSearchService = reportSearchService;
        this.restrictionService = restrictionService;
    }
    async search(response, dto) {
        response.status(common_1.HttpStatus.OK);
        response.send(await this.reportSearchService.search(dto));
    }
    async test() {
        return Report_1.Report.scope(['defaultScope', 'withContent']).findAll({
            subQuery: false,
            include: [
                {
                    model: User_1.User,
                    as: 'reporter',
                }
            ],
            where: {
                handled: 0,
            },
            limit: 11,
            order: [['createdAt', 'DESC']]
        });
    }
    async create(request, response, dto) {
        this.authService.getUser(request)
            .then(async (user) => {
            if (await this.restrictionService.hasActiveRestriction(user, RestrictionTypeId_1.default.ReportingBan)) {
                response.status(common_1.HttpStatus.FORBIDDEN);
                response.send({ error: ApiErrorId_1.default.UserBannedFromReporting });
            }
            else {
                return Report_1.Report.create({
                    ...dto,
                    reporterId: user.id,
                    handled: 0,
                })
                    .then(report => {
                    response.status(common_1.HttpStatus.OK);
                    response.send();
                })
                    .catch(e => {
                    if (e.errors[0].type === 'unique violation') {
                        response.status(common_1.HttpStatus.UNPROCESSABLE_ENTITY);
                        response.send();
                    }
                    else {
                        throw e;
                    }
                });
            }
        });
    }
    async handle(reportId) {
        return Report_1.Report.update({
            handled: true,
        }, {
            where: {
                id: reportId
            },
        });
    }
};
__decorate([
    common_1.Post('search'),
    common_1.UseGuards(moderator_guard_1.ModeratorGuard),
    __param(0, common_1.Res()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "search", null);
__decorate([
    common_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "test", null);
__decorate([
    common_1.Post(),
    common_1.UseGuards(authenticated_guard_1.AuthenticatedGuard),
    __param(0, common_1.Req()),
    __param(1, common_1.Res()),
    __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "create", null);
__decorate([
    common_1.Put(':id/handle'),
    common_1.UseGuards(moderator_guard_1.ModeratorGuard),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "handle", null);
ReportController = __decorate([
    common_1.Controller('report'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        guide_history_entry_service_1.GuideHistoryEntryService,
        rights_service_1.RightsService,
        report_search_service_1.ReportSearchService,
        restriction_service_1.RestrictionService])
], ReportController);
exports.ReportController = ReportController;
//# sourceMappingURL=report.controller.js.map
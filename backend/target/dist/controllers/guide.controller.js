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
exports.GuideController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../services/auth.service");
const authenticated_guard_1 = require("../services/authenticated.guard");
const guide_history_entry_service_1 = require("../services/guide-history-entry.service");
const Guide_1 = require("../database/models/Guide");
const moderation_service_1 = require("../services/moderation.service");
const GuideSearchPageDto_1 = __importDefault(require("../data/dto/GuideSearchPageDto"));
const guide_search_service_1 = require("../services/guide-search.service");
const EmptyDescriptorException_1 = __importDefault(require("../services/EmptyDescriptorException"));
const GuideHistoryEntryCreateDto_1 = __importDefault(require("../data/dto/GuideHistoryEntryCreateDto"));
const GuideHistoryEntryAppendDto_1 = __importDefault(require("../data/dto/GuideHistoryEntryAppendDto"));
const GuideHead_1 = require("../database/models/GuideHead");
const GuideHeadDto_1 = require("../data/dto/GuideHeadDto");
const ApiErrorId_1 = __importDefault(require("../data/ApiErrorId"));
const restriction_service_1 = require("../services/restriction.service");
const RestrictionTypeId_1 = __importDefault(require("../data/RestrictionTypeId"));
const GuideSearchByAuthorQuery_1 = __importDefault(require("../data/dto/GuideSearchByAuthorQuery"));
const search_cache_service_1 = __importDefault(require("../services/search-cache.service"));
const GuideHistoryEntry_1 = require("../database/models/GuideHistoryEntry");
let GuideController = class GuideController {
    constructor(authService, guideHistoryEntryService, moderationService, guideSearchService, restrictionService, guideSearchCache) {
        this.authService = authService;
        this.guideHistoryEntryService = guideHistoryEntryService;
        this.moderationService = moderationService;
        this.guideSearchService = guideSearchService;
        this.restrictionService = restrictionService;
        this.guideSearchCache = guideSearchCache;
    }
    async get(request, response, id) {
        this.authService.getUser(request)
            .then(user => {
            return GuideHead_1.GuideHead.findOne({
                where: {
                    guideId: id,
                },
                include: GuideHead_1.GuideHead.includesForDto()
            })
                .then(head => {
                if (head === null) {
                    response.status(common_1.HttpStatus.NOT_FOUND);
                    response.send();
                }
                else if (!head.guideHistoryEntry.guide.isPublic
                    && (user === null
                        || user.id !== head.guideHistoryEntry.guide.authorId
                            && !this.moderationService.isModerator(user))) {
                    response.status(common_1.HttpStatus.FORBIDDEN);
                    response.send();
                }
                else {
                    response.status(common_1.HttpStatus.OK);
                    response.send(head.toDto());
                }
            });
        });
    }
    async create(response, request, dto) {
        const user = await this.authService.getUser(request);
        try {
            const entry = await this.guideHistoryEntryService.create(dto, user);
            if (entry === guide_history_entry_service_1.SaveResult.SavingDuplicateRejected) {
                response.status(common_1.HttpStatus.ACCEPTED);
                response.send();
            }
            else if (entry === guide_history_entry_service_1.SaveResult.UserBannedFromGuideCreation) {
                response.status(common_1.HttpStatus.FORBIDDEN);
                response.send({ error: ApiErrorId_1.default.UserBannedFromEditingGuides });
            }
            else {
                response.status(common_1.HttpStatus.CREATED);
                response.send({
                    guideId: entry.guideId
                });
            }
        }
        catch (e) {
            if (e instanceof EmptyDescriptorException_1.default) {
                response.status(common_1.HttpStatus.UNPROCESSABLE_ENTITY);
                response.send();
            }
            else {
                throw e;
            }
        }
    }
    async update(response, request, dto) {
        const user = await this.authService.getUser(request);
        if (dto.isPublic === true
            && await this.restrictionService.hasActiveRestriction(user, RestrictionTypeId_1.default.ForceGuidePrivate, dto.guideId)) {
            response.status(common_1.HttpStatus.FORBIDDEN);
            response.send({ error: ApiErrorId_1.default.GuideForcedToBePrivate });
        }
        else if ((await Guide_1.Guide.findOne({ where: { id: dto.guideId } })).authorId !== user.id
            && !this.moderationService.isModerator(user)) {
            response.status(common_1.HttpStatus.FORBIDDEN);
            response.send();
        }
        else {
            try {
                const entry = await this.guideHistoryEntryService.append(dto, user);
                if (entry === guide_history_entry_service_1.SaveResult.SavingDuplicateRejected) {
                    response.status(common_1.HttpStatus.ACCEPTED);
                    response.send();
                }
                else {
                    response.status(common_1.HttpStatus.OK);
                    response.send();
                }
            }
            catch (e) {
                if (e instanceof EmptyDescriptorException_1.default) {
                    response.status(common_1.HttpStatus.UNPROCESSABLE_ENTITY);
                    response.send();
                }
                else {
                    throw e;
                }
            }
        }
    }
    async deactivate(response, request, target) {
        const user = await this.authService.getUser(request);
        const guide = await Guide_1.Guide.findOne({
            where: { id: target.id },
            include: [{
                    association: 'head',
                    include: [{
                            association: 'guideHistoryEntry',
                            include: [{
                                    association: 'descriptor',
                                    include: [{ all: true }]
                                }]
                        }],
                }]
        });
        if (guide === null) {
            response.status(common_1.HttpStatus.NOT_FOUND);
        }
        else if (guide.authorId !== user.id
            && !this.moderationService.isModerator(user)) {
            response.status(common_1.HttpStatus.FORBIDDEN);
        }
        else {
            if (!guide.isActive()) {
                response.status(common_1.HttpStatus.METHOD_NOT_ALLOWED);
            }
            else {
                await guide.deactivate(user)
                    .then(guide => {
                    this.guideSearchCache.clear(guide.head.guideHistoryEntry.descriptor.toDto());
                });
                response.status(common_1.HttpStatus.NO_CONTENT);
            }
        }
        response.send();
    }
    async activate(response, request, target) {
        const user = await this.authService.getUser(request);
        const guide = await Guide_1.Guide.findOne({ where: { id: target.id } });
        if (guide === null) {
            response.status(common_1.HttpStatus.NOT_FOUND);
        }
        else if (guide.authorId !== user.id
            && !this.moderationService.isModerator(user)) {
            response.status(common_1.HttpStatus.FORBIDDEN);
        }
        else {
            if (guide.isActive()) {
                response.status(common_1.HttpStatus.METHOD_NOT_ALLOWED);
            }
            else {
                await guide.activate(user);
                response.status(common_1.HttpStatus.NO_CONTENT);
            }
        }
        response.send();
    }
    async searchPost(query) {
        return this.guideSearchCache.getOrSet(query, () => this.guideSearchService.search(query));
    }
    async searchByVideo(videoId) {
        return GuideHead_1.GuideHead.findAll({
            include: GuideHead_1.GuideHead.includesForDto({
                excerpt: {
                    where: {
                        youtubeVideoId: videoId,
                    },
                    required: true,
                },
                guidePartVideos: {
                    required: true,
                },
            })
        })
            .then(guides => guides.map(g => g.toDto()));
    }
    async searchByAuthor(query, response) {
        this.guideSearchService.searchByAuthor(query)
            .then(page => {
            response.status(common_1.HttpStatus.OK);
            response.send(page);
        });
    }
};
__decorate([
    common_1.Get(':id'),
    __param(0, common_1.Req()),
    __param(1, common_1.Res()),
    __param(2, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Number]),
    __metadata("design:returntype", Promise)
], GuideController.prototype, "get", null);
__decorate([
    common_1.Post('create'),
    common_1.UseGuards(authenticated_guard_1.AuthenticatedGuard),
    __param(0, common_1.Res()),
    __param(1, common_1.Req()),
    __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], GuideController.prototype, "create", null);
__decorate([
    common_1.Post('update'),
    common_1.UseGuards(authenticated_guard_1.AuthenticatedGuard),
    __param(0, common_1.Res()),
    __param(1, common_1.Req()),
    __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], GuideController.prototype, "update", null);
__decorate([
    common_1.Post('deactivate'),
    common_1.UseGuards(authenticated_guard_1.AuthenticatedGuard),
    __param(0, common_1.Res()),
    __param(1, common_1.Req()),
    __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], GuideController.prototype, "deactivate", null);
__decorate([
    common_1.Post('activate'),
    common_1.UseGuards(authenticated_guard_1.AuthenticatedGuard),
    __param(0, common_1.Res()),
    __param(1, common_1.Req()),
    __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], GuideController.prototype, "activate", null);
__decorate([
    common_1.Post('search'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [guide_search_service_1.GuideSearchQuery]),
    __metadata("design:returntype", Promise)
], GuideController.prototype, "searchPost", null);
__decorate([
    common_1.Get('search-by-video/:videoId'),
    __param(0, common_1.Param('videoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GuideController.prototype, "searchByVideo", null);
__decorate([
    common_1.Post('search-by-author'),
    __param(0, common_1.Body()),
    __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GuideController.prototype, "searchByAuthor", null);
GuideController = __decorate([
    common_1.Controller('guide'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        guide_history_entry_service_1.GuideHistoryEntryService,
        moderation_service_1.ModerationService,
        guide_search_service_1.GuideSearchService,
        restriction_service_1.RestrictionService,
        search_cache_service_1.default])
], GuideController);
exports.GuideController = GuideController;
//# sourceMappingURL=guide.controller.js.map
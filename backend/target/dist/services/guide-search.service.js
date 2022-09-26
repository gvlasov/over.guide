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
var GuideSearchService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuideSearchService = exports.GuideSearchQuery = void 0;
const common_1 = require("@nestjs/common");
const GuideSearchPageDto_1 = __importDefault(require("../data/dto/GuideSearchPageDto"));
const guide_descriptor_service_1 = require("./guide-descriptor.service");
const GuideSearchQueryDto_1 = __importDefault(require("../data/dto/GuideSearchQueryDto"));
const HeroId_1 = __importDefault(require("../data/HeroId"));
const MapId_1 = __importDefault(require("../data/MapId"));
const GuideTheme_1 = __importDefault(require("../data/GuideTheme"));
const sequelize_1 = require("sequelize");
const GuideHead_1 = require("../database/models/GuideHead");
const AbilityId_1 = __importDefault(require("../data/AbilityId"));
const class_validator_1 = require("class-validator");
const sequelize_typescript_1 = require("sequelize-typescript");
const constants_1 = require("../constants");
const GuideSearchByAuthorQuery_1 = __importDefault(require("../data/dto/GuideSearchByAuthorQuery"));
class GuideSearchQuery {
    constructor() {
        this.playerHeroes = [];
        this.playerAbilities = [];
        this.teammateHeroes = [];
        this.teammateAbilities = [];
        this.enemyHeroes = [];
        this.enemyAbilities = [];
        this.mapTags = [];
        this.thematicTags = [];
    }
}
__decorate([
    class_validator_1.IsDefined({ always: true }),
    __metadata("design:type", Array)
], GuideSearchQuery.prototype, "clientAlreadyHasGuideIds", void 0);
exports.GuideSearchQuery = GuideSearchQuery;
let GuideSearchService = GuideSearchService_1 = class GuideSearchService {
    constructor(sequelize, guideDescriptorService) {
        this.sequelize = sequelize;
        this.guideDescriptorService = guideDescriptorService;
    }
    async search(query) {
        const nextGuides = await GuideHead_1.GuideHead.findAll({
            include: GuideHead_1.GuideHead.includesForDto({
                guideHistoryEntry: {
                    where: this.guideDescriptorService.isEmpty(query)
                        ? {}
                        : {
                            descriptorId: await this.getDescriptorIds(query),
                        }
                },
                guide: {
                    where: {
                        isPublic: true,
                        deactivatedAt: null,
                        deactivatedById: null,
                    }
                }
            }),
            where: {
                guideId: {
                    [sequelize_1.Op.notIn]: query.clientAlreadyHasGuideIds
                },
            },
            limit: GuideSearchService_1.pageSize + 1,
            order: [['guideId', 'DESC']]
        });
        return {
            items: nextGuides
                .slice(0, GuideSearchService_1.pageSize)
                .map(entry => entry.toDto()),
            hasNextPage: nextGuides.length > GuideSearchService_1.pageSize,
        };
    }
    async getDescriptorIds(query) {
        let descriptors;
        if (query.exact) {
            descriptors = await this.guideDescriptorService.getExact(query).then(descriptor => {
                if (descriptor === null) {
                    return [];
                }
                else {
                    return [descriptor];
                }
            });
        }
        else {
            descriptors = await this.guideDescriptorService.getIncluding(query);
        }
        return descriptors
            .map(descriptor => descriptor.id);
    }
    async searchByAuthor(query) {
        const nextGuides = await GuideHead_1.GuideHead.findAll({
            include: GuideHead_1.GuideHead.includesForDto({
                author: {
                    where: {
                        id: query.authorId,
                    }
                }
            }),
            where: {
                guideId: {
                    [sequelize_1.Op.notIn]: query.clientAlreadyHasGuideIds
                },
            },
            limit: GuideSearchService_1.pageSize + 1,
            order: [['guideId', 'DESC']]
        });
        return {
            items: nextGuides
                .slice(0, GuideSearchService_1.pageSize)
                .map(head => head.toDto()),
            hasNextPage: nextGuides.length > GuideSearchService_1.pageSize,
        };
    }
};
GuideSearchService.pageSize = 10;
GuideSearchService = GuideSearchService_1 = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(constants_1.SEQUELIZE)),
    __metadata("design:paramtypes", [sequelize_typescript_1.Sequelize,
        guide_descriptor_service_1.GuideDescriptorService])
], GuideSearchService);
exports.GuideSearchService = GuideSearchService;
//# sourceMappingURL=guide-search.service.js.map
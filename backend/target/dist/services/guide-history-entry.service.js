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
var GuideHistoryEntryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuideHistoryEntryService = exports.SaveResult = void 0;
const common_1 = require("@nestjs/common");
const User_1 = require("../database/models/User");
const Guide_1 = require("../database/models/Guide");
const GuideHistoryEntry_1 = require("../database/models/GuideHistoryEntry");
const GuidePartText_1 = require("../database/models/GuidePartText");
const GuidePartVideo_1 = require("../database/models/GuidePartVideo");
const guide_descriptor_service_1 = require("./guide-descriptor.service");
const GuidePartTextDto_1 = __importDefault(require("../data/dto/GuidePartTextDto"));
const GuidePartVideoDto_1 = __importDefault(require("../data/dto/GuidePartVideoDto"));
const YoutubeVideoExcerpt_1 = require("../database/models/YoutubeVideoExcerpt");
const GuideHistoryEntry2GuidePartText_1 = require("../database/models/GuideHistoryEntry2GuidePartText");
const GuideHistoryEntry2GuidePartVideo_1 = require("../database/models/GuideHistoryEntry2GuidePartVideo");
const constants_1 = require("../constants");
const sequelize_typescript_1 = require("sequelize-typescript");
const content_hash_service_1 = require("./content-hash.service");
const GuideHistoryEntryAppendDto_1 = __importDefault(require("../data/dto/GuideHistoryEntryAppendDto"));
const GuideHistoryEntryCreateDto_1 = __importDefault(require("../data/dto/GuideHistoryEntryCreateDto"));
const GuideHistoryEntryDto_1 = __importDefault(require("../data/dto/GuideHistoryEntryDto"));
const RestrictionTypeId_1 = __importDefault(require("../data/RestrictionTypeId"));
const restriction_service_1 = require("./restriction.service");
const search_cache_service_1 = __importDefault(require("./search-cache.service"));
const thumbnail_service_1 = require("./thumbnail.service");
var SaveResult;
(function (SaveResult) {
    SaveResult[SaveResult["SavingDuplicateRejected"] = 0] = "SavingDuplicateRejected";
    SaveResult[SaveResult["UserBannedFromGuideCreation"] = 1] = "UserBannedFromGuideCreation";
})(SaveResult = exports.SaveResult || (exports.SaveResult = {}));
let GuideHistoryEntryService = GuideHistoryEntryService_1 = class GuideHistoryEntryService {
    constructor(guideDescriptorService, contentHashService, sequelize, restrictionService, guideSearchCache, thumbnailService) {
        this.guideDescriptorService = guideDescriptorService;
        this.contentHashService = contentHashService;
        this.sequelize = sequelize;
        this.restrictionService = restrictionService;
        this.guideSearchCache = guideSearchCache;
        this.thumbnailService = thumbnailService;
    }
    async create(gheDto, saver) {
        return this.save(gheDto, () => Guide_1.Guide.create({
            authorId: saver.id,
            isPublic: gheDto.isPublic
        }), saver);
    }
    async append(gheDto, saver) {
        return this.save(gheDto, () => Guide_1.Guide.findOne({ where: { id: gheDto.guideId } })
            .then(guide => {
            if (!!guide.isPublic !== gheDto.isPublic) {
                return guide.update({ isPublic: !!gheDto.isPublic === true ? 1 : 0 });
            }
            else {
                return guide;
            }
        }), saver);
    }
    async save(gheDto, obtainModel, saver) {
        return this.sequelize.transaction(async (t) => {
            if (await this.restrictionService.hasActiveRestriction(saver, RestrictionTypeId_1.default.GuideCreationBan)) {
                return SaveResult.UserBannedFromGuideCreation;
            }
            const descriptor = await this.guideDescriptorService.obtainExact(gheDto.descriptor);
            const guide = await obtainModel();
            const oldEntry = await GuideHistoryEntry_1.GuideHistoryEntry.findOne({
                include: [{ all: true }],
                where: {
                    guideId: guide.id
                },
                order: [['id', 'DESC']],
            });
            const contentHash = this.contentHashService.hash(gheDto, (dto) => {
                delete dto.guideId;
            });
            if (oldEntry !== null && oldEntry.contentHash === contentHash) {
                return SaveResult.SavingDuplicateRejected;
            }
            const newEntry = await GuideHistoryEntry_1.GuideHistoryEntry.create({
                descriptorId: descriptor.id,
                guideId: guide.id,
                updaterId: saver.id,
                contentHash: contentHash,
            });
            await Promise.all(gheDto.parts.map(async (partDto) => {
                if (partDto.kind === 'text') {
                    return GuideHistoryEntryService_1.obtainGuidePartText(partDto);
                }
                else if (partDto.kind === 'video') {
                    return this.obtainGuidePartVideo(partDto);
                }
            })
                .map((partPromise, index) => {
                return partPromise.then((part) => {
                    if (part instanceof GuidePartText_1.GuidePartText) {
                        return GuideHistoryEntry2GuidePartText_1.GuideHistoryEntry2GuidePartText.create({
                            guideHistoryEntryId: newEntry.id,
                            guidePartTextId: part.id,
                            order: index
                        });
                    }
                    else if (part instanceof GuidePartVideo_1.GuidePartVideo) {
                        return GuideHistoryEntry2GuidePartVideo_1.GuideHistoryEntry2GuidePartVideo.create({
                            guideHistoryEntryId: newEntry.id,
                            guidePartVideoId: part.id,
                            order: index
                        });
                    }
                    else {
                        throw new Error(`${JSON.stringify(part)} is not supported as a guide part`);
                    }
                });
            }));
            this.guideSearchCache.clear(gheDto.descriptor);
            return newEntry;
        });
    }
    static async obtainGuidePartText(partDto) {
        return GuidePartText_1.GuidePartText.findOne({
            where: {
                contentMd: partDto.contentMd,
            }
        })
            .then(part => {
            if (part !== null) {
                return part;
            }
            else {
                return GuidePartText_1.GuidePartText.create(partDto);
            }
        });
    }
    async obtainGuidePartVideo(partDto) {
        return YoutubeVideoExcerpt_1.YoutubeVideoExcerpt.findOne({
            where: {
                youtubeVideoId: partDto.excerpt.youtubeVideoId,
                startSeconds: partDto.excerpt.startSeconds,
                endSeconds: partDto.excerpt.endSeconds,
                thumbnail: partDto.excerpt.thumbnail,
            }
        })
            .then(excerpt => {
            if (excerpt === null) {
                const excerptData = Object.assign({}, partDto.excerpt);
                delete excerptData.id;
                return YoutubeVideoExcerpt_1.YoutubeVideoExcerpt.create(excerptData)
                    .then((excerpt) => this.thumbnailService
                    .updateThumbnail(excerpt)
                    .then(() => {
                    return GuidePartVideo_1.GuidePartVideo.create({ excerptId: excerpt.id });
                }));
            }
            else {
                return GuidePartVideo_1.GuidePartVideo.findOne({
                    where: {
                        excerptId: excerpt.id,
                    }
                })
                    .then(part => {
                    if (part === null) {
                        return GuidePartVideo_1.GuidePartVideo.create({
                            excerptId: excerpt.id,
                        });
                    }
                    else {
                        return part;
                    }
                });
            }
        });
    }
};
GuideHistoryEntryService = GuideHistoryEntryService_1 = __decorate([
    common_1.Injectable(),
    __param(2, common_1.Inject(constants_1.SEQUELIZE)),
    __metadata("design:paramtypes", [guide_descriptor_service_1.GuideDescriptorService,
        content_hash_service_1.ContentHashService,
        sequelize_typescript_1.Sequelize,
        restriction_service_1.RestrictionService,
        search_cache_service_1.default,
        thumbnail_service_1.ThumbnailService])
], GuideHistoryEntryService);
exports.GuideHistoryEntryService = GuideHistoryEntryService;
//# sourceMappingURL=guide-history-entry.service.js.map
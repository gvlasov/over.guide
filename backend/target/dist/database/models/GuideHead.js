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
exports.GuideHead = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
const GuideHistoryEntry_1 = require("./GuideHistoryEntry");
const fixture_service_1 = require("../../services/fixture.service");
const GuideHeadDto_1 = __importDefault(require("../../data/dto/GuideHeadDto"));
const Guide_1 = require("./Guide");
const User_1 = require("./User");
const GuidePartText_1 = require("./GuidePartText");
const GuidePartVideo_1 = require("./GuidePartVideo");
const GuideDescriptor_1 = require("./GuideDescriptor");
const YoutubeVideoExcerpt_1 = require("./YoutubeVideoExcerpt");
const User2TrainingGoal_1 = require("./User2TrainingGoal");
const GuideHistoryEntryReadDto_1 = __importDefault(require("../../data/dto/GuideHistoryEntryReadDto"));
let GuideHead = class GuideHead extends sequelize_typescript_1.Model {
    toDto() {
        return {
            guideHistoryEntry: this.guideHistoryEntry.toDto(),
            commentsCount: this.commentsCount,
            votesCount: this.votesCount,
        };
    }
    static includesForDto(options) {
        return [
            {
                model: GuideHistoryEntry_1.GuideHistoryEntry,
                as: 'guideHistoryEntry',
                required: true,
                ...options === null || options === void 0 ? void 0 : options.guideHistoryEntry,
                include: [
                    {
                        model: Guide_1.Guide,
                        as: 'guide',
                        where: {
                            deactivatedById: null,
                            deactivatedAt: null,
                        },
                        ...options === null || options === void 0 ? void 0 : options.guide,
                        include: [{
                                model: User_1.User,
                                as: 'author',
                                ...options === null || options === void 0 ? void 0 : options.author,
                            }]
                    },
                    {
                        model: GuidePartText_1.GuidePartText, as: 'guidePartTexts',
                        include: [{ all: true }],
                    },
                    {
                        model: GuidePartVideo_1.GuidePartVideo, as: 'guidePartVideos',
                        include: [{
                                model: YoutubeVideoExcerpt_1.YoutubeVideoExcerpt,
                                as: 'excerpt',
                                ...options === null || options === void 0 ? void 0 : options.excerpt
                            }],
                        ...options === null || options === void 0 ? void 0 : options.guidePartVideos
                    },
                    {
                        model: GuideDescriptor_1.GuideDescriptor,
                        as: 'descriptor',
                        include: [{ all: true }],
                        ...options === null || options === void 0 ? void 0 : options.descriptor,
                    },
                ]
            },
        ];
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], GuideHead.prototype, "guideId", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => GuideHistoryEntry_1.GuideHistoryEntry),
    sequelize_typescript_1.Column({ type: new sequelize_1.DataTypes.INTEGER() }),
    __metadata("design:type", Number)
], GuideHead.prototype, "guideHistoryEntryId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => GuideHistoryEntry_1.GuideHistoryEntry, 'guideHistoryEntryId'),
    __metadata("design:type", GuideHistoryEntry_1.GuideHistoryEntry)
], GuideHead.prototype, "guideHistoryEntry", void 0);
__decorate([
    sequelize_typescript_1.Column({ type: new sequelize_1.DataTypes.INTEGER() }),
    __metadata("design:type", Number)
], GuideHead.prototype, "votesCount", void 0);
__decorate([
    sequelize_typescript_1.Column({ type: new sequelize_1.DataTypes.INTEGER() }),
    __metadata("design:type", Number)
], GuideHead.prototype, "commentsCount", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => User2TrainingGoal_1.User2TrainingGoal, {
        foreignKey: 'guideId',
        targetKey: 'guideId'
    }),
    __metadata("design:type", User2TrainingGoal_1.User2TrainingGoal)
], GuideHead.prototype, "user2TrainingGoal", void 0);
GuideHead = __decorate([
    sequelize_typescript_1.Table({
        createdAt: false,
        updatedAt: false,
    }),
    fixture_service_1.ActuallyNotTableButView
], GuideHead);
exports.GuideHead = GuideHead;
//# sourceMappingURL=GuideHead.js.map
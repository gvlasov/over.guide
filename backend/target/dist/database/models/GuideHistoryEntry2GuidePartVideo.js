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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuideHistoryEntry2GuidePartVideo = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const GuideHistoryEntry_1 = require("./GuideHistoryEntry");
const GuidePartVideo_1 = require("./GuidePartVideo");
const sequelize_1 = require("sequelize");
let GuideHistoryEntry2GuidePartVideo = class GuideHistoryEntry2GuidePartVideo extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => GuideHistoryEntry_1.GuideHistoryEntry),
    __metadata("design:type", Number)
], GuideHistoryEntry2GuidePartVideo.prototype, "guideHistoryEntryId", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => GuidePartVideo_1.GuidePartVideo),
    __metadata("design:type", Number)
], GuideHistoryEntry2GuidePartVideo.prototype, "guidePartVideoId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => GuideHistoryEntry_1.GuideHistoryEntry, 'guideHistoryEntryId'),
    __metadata("design:type", GuideHistoryEntry_1.GuideHistoryEntry)
], GuideHistoryEntry2GuidePartVideo.prototype, "guideHistoryEntry", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => GuidePartVideo_1.GuidePartVideo, 'guidePartVideoId'),
    __metadata("design:type", GuidePartVideo_1.GuidePartVideo)
], GuideHistoryEntry2GuidePartVideo.prototype, "guidePartVideo", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column({ type: new sequelize_1.DataTypes.INTEGER }),
    __metadata("design:type", Number)
], GuideHistoryEntry2GuidePartVideo.prototype, "order", void 0);
GuideHistoryEntry2GuidePartVideo = __decorate([
    sequelize_typescript_1.Table({
        name: {
            singular: 'GuideHistoryEntry2GuidePartVideo',
            plural: 'GuideHistoryEntry2GuidePartVideos',
        },
        createdAt: false,
        updatedAt: false,
    })
], GuideHistoryEntry2GuidePartVideo);
exports.GuideHistoryEntry2GuidePartVideo = GuideHistoryEntry2GuidePartVideo;
//# sourceMappingURL=GuideHistoryEntry2GuidePartVideo.js.map
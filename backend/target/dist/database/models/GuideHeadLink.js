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
exports.GuideHeadLink = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
const GuideHistoryEntry_1 = require("./GuideHistoryEntry");
const Guide_1 = require("./Guide");
const fixture_service_1 = require("../../services/fixture.service");
let GuideHeadLink = class GuideHeadLink extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.ForeignKey(() => Guide_1.Guide),
    sequelize_typescript_1.Column({ type: new sequelize_1.DataTypes.INTEGER() }),
    __metadata("design:type", Number)
], GuideHeadLink.prototype, "guideId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => Guide_1.Guide, 'guideId'),
    __metadata("design:type", Guide_1.Guide)
], GuideHeadLink.prototype, "guide", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => GuideHistoryEntry_1.GuideHistoryEntry),
    sequelize_typescript_1.Column({ type: new sequelize_1.DataTypes.INTEGER() }),
    __metadata("design:type", Number)
], GuideHeadLink.prototype, "guideHistoryEntryId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => GuideHistoryEntry_1.GuideHistoryEntry, 'guideHistoryEntryId'),
    __metadata("design:type", GuideHistoryEntry_1.GuideHistoryEntry)
], GuideHeadLink.prototype, "guideHistoryEntry", void 0);
GuideHeadLink = __decorate([
    sequelize_typescript_1.Table({
        createdAt: false,
        updatedAt: false,
    }),
    fixture_service_1.ActuallyNotTableButView
], GuideHeadLink);
exports.GuideHeadLink = GuideHeadLink;
//# sourceMappingURL=GuideHeadLink.js.map
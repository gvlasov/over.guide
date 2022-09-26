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
exports.GuideHistoryEntry = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Guide_1 = require("./Guide");
const User_1 = require("./User");
const Hero_1 = require("./Hero");
const GuideDescriptor_1 = require("./GuideDescriptor");
const sequelize_1 = require("sequelize");
const GuidePartText_1 = require("./GuidePartText");
const GuideHistoryEntry2GuidePartText_1 = require("./GuideHistoryEntry2GuidePartText");
const GuidePartVideo_1 = require("./GuidePartVideo");
const GuideHistoryEntry2GuidePartVideo_1 = require("./GuideHistoryEntry2GuidePartVideo");
const GuideHistoryEntryReadDto_1 = __importDefault(require("../../data/dto/GuideHistoryEntryReadDto"));
let GuideHistoryEntry = class GuideHistoryEntry extends sequelize_typescript_1.Model {
    get partsOrdered() {
        return [
            ...this.guidePartTexts,
            ...this.guidePartVideos
        ].sort((a, b) => {
            let aOrder, bOrder;
            if (a instanceof GuidePartText_1.GuidePartText) {
                aOrder = a.GuideHistoryEntry2GuidePartText.dataValues.order;
            }
            else {
                aOrder = a.GuideHistoryEntry2GuidePartVideo.dataValues.order;
            }
            if (b instanceof GuidePartText_1.GuidePartText) {
                bOrder = b.GuideHistoryEntry2GuidePartText.dataValues.order;
            }
            else {
                bOrder = b.GuideHistoryEntry2GuidePartVideo.dataValues.order;
            }
            return aOrder - bOrder;
        });
    }
    toDto() {
        return {
            guide: this.guide.toDto(),
            updatedAt: this.updatedOn.toISOString(),
            descriptor: this.descriptor.toDto(),
            parts: this.partsOrdered.map(part => part.toDto()),
        };
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], GuideHistoryEntry.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.ForeignKey(() => Guide_1.Guide),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], GuideHistoryEntry.prototype, "guideId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => Guide_1.Guide, 'guideId'),
    __metadata("design:type", Guide_1.Guide)
], GuideHistoryEntry.prototype, "guide", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.ForeignKey(() => User_1.User),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], GuideHistoryEntry.prototype, "updaterId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => User_1.User, 'updaterId'),
    __metadata("design:type", Hero_1.Hero)
], GuideHistoryEntry.prototype, "updater", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.ForeignKey(() => GuideDescriptor_1.GuideDescriptor),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], GuideHistoryEntry.prototype, "descriptorId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => GuideDescriptor_1.GuideDescriptor, 'descriptorId'),
    __metadata("design:type", GuideDescriptor_1.GuideDescriptor)
], GuideHistoryEntry.prototype, "descriptor", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    sequelize_typescript_1.Column({ type: new sequelize_1.DataTypes.DATE(6) }),
    __metadata("design:type", Date)
], GuideHistoryEntry.prototype, "updatedOn", void 0);
__decorate([
    sequelize_typescript_1.BelongsToMany(() => GuidePartText_1.GuidePartText, {
        through: {
            model: () => GuideHistoryEntry2GuidePartText_1.GuideHistoryEntry2GuidePartText,
        }
    }),
    __metadata("design:type", Array)
], GuideHistoryEntry.prototype, "guidePartTexts", void 0);
__decorate([
    sequelize_typescript_1.BelongsToMany(() => GuidePartVideo_1.GuidePartVideo, {
        through: {
            model: () => GuideHistoryEntry2GuidePartVideo_1.GuideHistoryEntry2GuidePartVideo,
        }
    }),
    __metadata("design:type", Array)
], GuideHistoryEntry.prototype, "guidePartVideos", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column({ type: new sequelize_1.DataTypes.CHAR(32) }),
    __metadata("design:type", String)
], GuideHistoryEntry.prototype, "contentHash", void 0);
GuideHistoryEntry = __decorate([
    sequelize_typescript_1.Table({
        name: {
            singular: 'GuideHistoryEntry',
            plural: 'GuideHistoryEntries',
        },
        createdAt: false,
    })
], GuideHistoryEntry);
exports.GuideHistoryEntry = GuideHistoryEntry;
//# sourceMappingURL=GuideHistoryEntry.js.map
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
exports.Guide = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const User_1 = require("./User");
const GuideHistoryEntry_1 = require("./GuideHistoryEntry");
const sequelize_1 = require("sequelize");
const utc_date_1 = require("@hamroctopus/utc-date");
const GuideDto_1 = __importDefault(require("../../data/dto/GuideDto"));
const Vote_1 = require("./Vote");
const PostTypeId_1 = __importDefault(require("../../data/PostTypeId"));
const GuideHead_1 = require("./GuideHead");
let Guide = class Guide extends sequelize_typescript_1.Model {
    isActive() {
        return this.deactivatedById === null && this.deactivatedAt === null;
    }
    deactivate(user) {
        if (this.deactivatedById !== null
            || this.deactivatedAt !== null) {
            throw new Error('Already inactive');
        }
        return this.update({
            deactivatedById: user.id,
            deactivatedAt: utc_date_1.utcDate(),
        });
    }
    activate(user) {
        if (this.deactivatedById === null
            || this.deactivatedAt === null) {
            throw new Error('Already active');
        }
        return this.update({
            deactivatedById: null,
            deactivatedAt: null,
        });
    }
    toDto() {
        return {
            id: this.id,
            author: this.author.toDto(),
            createdAt: this.createdAt,
            isPublic: this.isPublic === 1,
        };
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Guide.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => User_1.User),
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Guide.prototype, "authorId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => User_1.User, 'authorId'),
    __metadata("design:type", User_1.User)
], Guide.prototype, "author", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => GuideHistoryEntry_1.GuideHistoryEntry),
    __metadata("design:type", Array)
], Guide.prototype, "historyEntries", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(true),
    sequelize_typescript_1.Column({ type: new sequelize_1.DataTypes.DATE() }),
    __metadata("design:type", Date)
], Guide.prototype, "deactivatedAt", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(true),
    sequelize_typescript_1.ForeignKey(() => User_1.User),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Guide.prototype, "deactivatedById", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => User_1.User, 'deactivatedById'),
    __metadata("design:type", User_1.User)
], Guide.prototype, "deactivatedBy", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column({ type: new sequelize_1.DataTypes.TINYINT({ length: 1, unsigned: true }) }),
    __metadata("design:type", Number)
], Guide.prototype, "isPublic", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => Vote_1.Vote, {
        foreignKey: 'postId',
        constraints: false,
        scope: {
            'postTypeId': PostTypeId_1.default.Guide,
        },
    }),
    __metadata("design:type", Array)
], Guide.prototype, "votes", void 0);
__decorate([
    sequelize_typescript_1.HasOne(() => GuideHead_1.GuideHead, 'guideId'),
    __metadata("design:type", GuideHead_1.GuideHead)
], Guide.prototype, "head", void 0);
Guide = __decorate([
    sequelize_typescript_1.Table({
        name: {
            singular: 'Guide',
            plural: 'Guides',
        },
        updatedAt: false,
    })
], Guide);
exports.Guide = Guide;
//# sourceMappingURL=Guide.js.map
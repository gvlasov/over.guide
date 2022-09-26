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
exports.GuidePartVideo = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const YoutubeVideoExcerpt_1 = require("./YoutubeVideoExcerpt");
const GuidePartVideoDto_1 = __importDefault(require("../../data/dto/GuidePartVideoDto"));
let GuidePartVideo = class GuidePartVideo extends sequelize_typescript_1.Model {
    toDto() {
        return {
            id: this.id,
            kind: 'video',
            excerpt: this.excerpt.toDto(),
        };
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], GuidePartVideo.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.ForeignKey(() => YoutubeVideoExcerpt_1.YoutubeVideoExcerpt),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], GuidePartVideo.prototype, "excerptId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => YoutubeVideoExcerpt_1.YoutubeVideoExcerpt),
    __metadata("design:type", YoutubeVideoExcerpt_1.YoutubeVideoExcerpt)
], GuidePartVideo.prototype, "excerpt", void 0);
GuidePartVideo = __decorate([
    sequelize_typescript_1.Table({
        name: {
            singular: 'GuidePartVideo',
            plural: 'GuidePartVideos',
        }
    })
], GuidePartVideo);
exports.GuidePartVideo = GuidePartVideo;
//# sourceMappingURL=GuidePartVideo.js.map
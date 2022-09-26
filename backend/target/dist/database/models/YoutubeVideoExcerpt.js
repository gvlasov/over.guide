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
exports.YoutubeVideoExcerpt = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
const YoutubeVideoExcerptDto_1 = __importDefault(require("../../data/dto/YoutubeVideoExcerptDto"));
let YoutubeVideoExcerpt = class YoutubeVideoExcerpt extends sequelize_typescript_1.Model {
    toDto() {
        return {
            id: this.id,
            youtubeVideoId: this.youtubeVideoId,
            startSeconds: this.startSeconds,
            endSeconds: this.endSeconds,
            thumbnail: this.thumbnail,
        };
    }
    get thumbnailUrl() {
        return process.env.CDN_BASE_URL + '/images/custom-thumbnails/' + this.id + '.jpg';
    }
};
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column({ type: new sequelize_1.DataTypes.STRING(16) }),
    __metadata("design:type", String)
], YoutubeVideoExcerpt.prototype, "youtubeVideoId", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column({ type: new sequelize_1.DataTypes.FLOAT(8, 3) }),
    __metadata("design:type", Number)
], YoutubeVideoExcerpt.prototype, "startSeconds", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column({ type: new sequelize_1.DataTypes.FLOAT(8, 3) }),
    __metadata("design:type", Number)
], YoutubeVideoExcerpt.prototype, "endSeconds", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(true),
    sequelize_typescript_1.Column({ type: new sequelize_1.DataTypes.FLOAT(8, 3) }),
    __metadata("design:type", Number)
], YoutubeVideoExcerpt.prototype, "thumbnail", void 0);
YoutubeVideoExcerpt = __decorate([
    sequelize_typescript_1.Table
], YoutubeVideoExcerpt);
exports.YoutubeVideoExcerpt = YoutubeVideoExcerpt;
//# sourceMappingURL=YoutubeVideoExcerpt.js.map
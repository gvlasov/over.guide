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
exports.GuidePartText = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
const GuidePartTextDto_1 = __importDefault(require("../../data/dto/GuidePartTextDto"));
let GuidePartText = class GuidePartText extends sequelize_typescript_1.Model {
    toDto() {
        return {
            contentMd: this.contentMd,
            kind: "text"
        };
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], GuidePartText.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column({ type: new sequelize_1.DataTypes.TEXT }),
    __metadata("design:type", String)
], GuidePartText.prototype, "contentMd", void 0);
GuidePartText = __decorate([
    sequelize_typescript_1.Table({
        name: {
            singular: 'GuidePartText',
            plural: 'GuidePartTexts',
        }
    })
], GuidePartText);
exports.GuidePartText = GuidePartText;
//# sourceMappingURL=GuidePartText.js.map
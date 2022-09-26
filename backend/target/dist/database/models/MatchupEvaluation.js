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
exports.MatchupEvaluation = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Hero_1 = require("./Hero");
const sequelize_1 = require("sequelize");
const Patch_1 = require("./Patch");
const User_1 = require("./User");
const MatchupEvaluationDto_1 = __importDefault(require("../../data/dto/MatchupEvaluationDto"));
const MatchupEvaluationUserScore_1 = __importDefault(require("../../data/MatchupEvaluationUserScore"));
let MatchupEvaluation = class MatchupEvaluation extends sequelize_typescript_1.Model {
    toDto() {
        return {
            subjectId: this.subjectId,
            objectId: this.objectId,
            score: this.score,
            patchId: this.patchId,
        };
    }
};
__decorate([
    sequelize_typescript_1.ForeignKey(() => Hero_1.Hero),
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], MatchupEvaluation.prototype, "subjectId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => Hero_1.Hero, 'subjectId'),
    __metadata("design:type", Hero_1.Hero)
], MatchupEvaluation.prototype, "subject", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => Hero_1.Hero),
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], MatchupEvaluation.prototype, "objectId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => Hero_1.Hero, 'objectId'),
    __metadata("design:type", Hero_1.Hero)
], MatchupEvaluation.prototype, "object", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column({ type: new sequelize_1.DataTypes.INTEGER() }),
    __metadata("design:type", Number)
], MatchupEvaluation.prototype, "score", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => User_1.User, 'createdById'),
    __metadata("design:type", User_1.User)
], MatchupEvaluation.prototype, "createdBy", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column({ type: new sequelize_1.DataTypes.STRING({ length: 45 }) }),
    __metadata("design:type", String)
], MatchupEvaluation.prototype, "ip", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column({ type: new sequelize_1.DataTypes.INTEGER() }),
    __metadata("design:type", Number)
], MatchupEvaluation.prototype, "createdById", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => Patch_1.Patch),
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], MatchupEvaluation.prototype, "patchId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => Patch_1.Patch, 'patchId'),
    __metadata("design:type", Patch_1.Patch)
], MatchupEvaluation.prototype, "patch", void 0);
MatchupEvaluation = __decorate([
    sequelize_typescript_1.Table
], MatchupEvaluation);
exports.MatchupEvaluation = MatchupEvaluation;
//# sourceMappingURL=MatchupEvaluation.js.map
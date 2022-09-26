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
exports.Sentence = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
const Restriction_1 = require("./Restriction");
const ImmediateAction_1 = require("./ImmediateAction");
const User_1 = require("./User");
let Sentence = class Sentence extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Sentence.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => User_1.User),
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column({ type: new sequelize_1.DataTypes.INTEGER() }),
    __metadata("design:type", Number)
], Sentence.prototype, "defenderId", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => User_1.User),
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column({ type: new sequelize_1.DataTypes.INTEGER() }),
    __metadata("design:type", Number)
], Sentence.prototype, "judgeId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => User_1.User, 'defenderId'),
    __metadata("design:type", User_1.User)
], Sentence.prototype, "defender", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => User_1.User, 'judgeId'),
    __metadata("design:type", User_1.User)
], Sentence.prototype, "judge", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => Restriction_1.Restriction, 'sentenceId'),
    __metadata("design:type", Array)
], Sentence.prototype, "restrictions", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => ImmediateAction_1.ImmediateAction, 'sentenceId'),
    __metadata("design:type", Array)
], Sentence.prototype, "immediateActions", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(true),
    sequelize_typescript_1.Column({ type: new sequelize_1.DataTypes.TEXT }),
    __metadata("design:type", String)
], Sentence.prototype, "judgeCommentary", void 0);
Sentence = __decorate([
    sequelize_typescript_1.Table
], Sentence);
exports.Sentence = Sentence;
//# sourceMappingURL=Sentence.js.map
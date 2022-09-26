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
var ImmediateAction_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImmediateAction = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
const Sentence_1 = require("./Sentence");
const ImmediateActionTypeId_1 = __importDefault(require("../../data/ImmediateActionTypeId"));
let ImmediateAction = ImmediateAction_1 = class ImmediateAction extends sequelize_typescript_1.Model {
};
ImmediateAction.uniqueKey = 'immediate_action_unique';
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ImmediateAction.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(true),
    sequelize_typescript_1.Column({
        type: new sequelize_1.DataTypes.INTEGER(),
        unique: ImmediateAction_1.uniqueKey,
    }),
    __metadata("design:type", Number)
], ImmediateAction.prototype, "objectId", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column({
        type: new sequelize_1.DataTypes.INTEGER(),
        unique: ImmediateAction_1.uniqueKey,
    }),
    __metadata("design:type", Number)
], ImmediateAction.prototype, "typeId", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => Sentence_1.Sentence),
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column({
        type: new sequelize_1.DataTypes.INTEGER(),
        unique: ImmediateAction_1.uniqueKey,
    }),
    __metadata("design:type", Number)
], ImmediateAction.prototype, "sentenceId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => Sentence_1.Sentence, 'sentenceId'),
    __metadata("design:type", Sentence_1.Sentence)
], ImmediateAction.prototype, "sentence", void 0);
ImmediateAction = ImmediateAction_1 = __decorate([
    sequelize_typescript_1.Table({})
], ImmediateAction);
exports.ImmediateAction = ImmediateAction;
//# sourceMappingURL=ImmediateAction.js.map
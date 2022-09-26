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
exports.Ability = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
const Patch_1 = require("./Patch");
const Hero_1 = require("./Hero");
let Ability = class Ability extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Ability.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Unique({ name: 'name', msg: '' }),
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column({ type: new sequelize_1.DataTypes.STRING(32) }),
    __metadata("design:type", String)
], Ability.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.Unique({ name: 'dataName', msg: '' }),
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column({ type: new sequelize_1.DataTypes.STRING(32) }),
    __metadata("design:type", String)
], Ability.prototype, "dataName", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => Hero_1.Hero),
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Ability.prototype, "heroId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => Hero_1.Hero, 'heroId'),
    __metadata("design:type", Hero_1.Hero)
], Ability.prototype, "hero", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => Patch_1.Patch),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Ability.prototype, "removedAtPatchId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => Patch_1.Patch, 'removedAtPatchId'),
    __metadata("design:type", Patch_1.Patch)
], Ability.prototype, "removedAtPatch", void 0);
Ability = __decorate([
    sequelize_typescript_1.Table
], Ability);
exports.Ability = Ability;
//# sourceMappingURL=Ability.js.map
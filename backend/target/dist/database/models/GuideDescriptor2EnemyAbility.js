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
exports.GuideDescriptor2EnemyAbility = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const GuideDescriptor_1 = require("./GuideDescriptor");
const Ability_1 = require("./Ability");
let GuideDescriptor2EnemyAbility = class GuideDescriptor2EnemyAbility extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => GuideDescriptor_1.GuideDescriptor),
    __metadata("design:type", Number)
], GuideDescriptor2EnemyAbility.prototype, "guideDescriptorId", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => Ability_1.Ability),
    __metadata("design:type", Number)
], GuideDescriptor2EnemyAbility.prototype, "abilityId", void 0);
GuideDescriptor2EnemyAbility = __decorate([
    sequelize_typescript_1.Table({
        name: {
            singular: 'GuideDescriptor2EnemyAbility',
            plural: 'GuideDescriptor2EnemyAbilities',
        },
        createdAt: false,
        updatedAt: false,
    })
], GuideDescriptor2EnemyAbility);
exports.GuideDescriptor2EnemyAbility = GuideDescriptor2EnemyAbility;
//# sourceMappingURL=GuideDescriptor2EnemyAbility.js.map
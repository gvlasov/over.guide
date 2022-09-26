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
exports.GuideDescriptor2EnemyHero = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Hero_1 = require("./Hero");
const GuideDescriptor_1 = require("./GuideDescriptor");
let GuideDescriptor2EnemyHero = class GuideDescriptor2EnemyHero extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => GuideDescriptor_1.GuideDescriptor),
    __metadata("design:type", Number)
], GuideDescriptor2EnemyHero.prototype, "guideDescriptorId", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => Hero_1.Hero),
    __metadata("design:type", Number)
], GuideDescriptor2EnemyHero.prototype, "heroId", void 0);
GuideDescriptor2EnemyHero = __decorate([
    sequelize_typescript_1.Table({
        name: {
            singular: 'GuideDescriptor2EnemyHero',
            plural: 'GuideDescriptor2EnemyHeroes',
        },
        createdAt: false,
        updatedAt: false,
    })
], GuideDescriptor2EnemyHero);
exports.GuideDescriptor2EnemyHero = GuideDescriptor2EnemyHero;
//# sourceMappingURL=GuideDescriptor2EnemyHero.js.map
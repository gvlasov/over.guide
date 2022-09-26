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
exports.Hero = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
const Role_1 = __importDefault(require("../../data/Role"));
let Hero = class Hero extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Hero.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Unique({ name: 'name', msg: '' }),
    sequelize_typescript_1.Column({ type: new sequelize_1.DataTypes.STRING(20) }),
    __metadata("design:type", String)
], Hero.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Unique({ name: 'dataName', msg: '' }),
    sequelize_typescript_1.Column({ type: new sequelize_1.DataTypes.STRING(20) }),
    __metadata("design:type", String)
], Hero.prototype, "dataName", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Hero.prototype, "role", void 0);
Hero = __decorate([
    sequelize_typescript_1.Table({
        name: {
            singular: 'Hero',
            plural: 'Heroes',
        },
        createdAt: false,
        updatedAt: false
    })
], Hero);
exports.Hero = Hero;
//# sourceMappingURL=Hero.js.map
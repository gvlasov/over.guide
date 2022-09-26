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
exports.User2TrainingGoal = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
const Guide_1 = require("./Guide");
const User_1 = require("./User");
let User2TrainingGoal = class User2TrainingGoal extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => User_1.User),
    __metadata("design:type", Number)
], User2TrainingGoal.prototype, "userId", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column,
    sequelize_typescript_1.ForeignKey(() => Guide_1.Guide),
    __metadata("design:type", Number)
], User2TrainingGoal.prototype, "guideId", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column({ type: new sequelize_1.DataTypes.INTEGER({ unsigned: true }) }),
    __metadata("design:type", Number)
], User2TrainingGoal.prototype, "order", void 0);
User2TrainingGoal = __decorate([
    sequelize_typescript_1.Table({
        name: {
            singular: 'User2BookmarkedGuide',
            plural: 'User2BookmarkedGuides',
        },
        createdAt: false,
        updatedAt: false,
    })
], User2TrainingGoal);
exports.User2TrainingGoal = User2TrainingGoal;
//# sourceMappingURL=User2TrainingGoal.js.map
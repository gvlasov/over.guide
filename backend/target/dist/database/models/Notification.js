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
exports.Notification = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
const User_1 = require("./User");
const NotificationTypeId_1 = __importDefault(require("../../data/NotificationTypeId"));
const NotificationReadDto_1 = __importDefault(require("../../data/dto/NotificationReadDto"));
let Notification = class Notification extends sequelize_typescript_1.Model {
    toDto() {
        return {
            id: this.id,
            notificationTypeId: this.notificationTypeId,
            json: JSON.parse(this.json),
            createdAt: this.createdAt,
            read: this.read,
        };
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Notification.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.ForeignKey(() => User_1.User),
    sequelize_typescript_1.Column({ type: new sequelize_1.DataTypes.INTEGER() }),
    __metadata("design:type", Number)
], Notification.prototype, "userId", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column({ type: new sequelize_1.DataTypes.INTEGER() }),
    __metadata("design:type", Number)
], Notification.prototype, "notificationTypeId", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column({ type: new sequelize_1.DataTypes.TEXT() }),
    __metadata("design:type", String)
], Notification.prototype, "json", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column({
        type: new sequelize_1.DataTypes.TINYINT({
            unsigned: true,
            length: 1,
        }),
        defaultValue: false
    }),
    __metadata("design:type", Boolean)
], Notification.prototype, "read", void 0);
Notification = __decorate([
    sequelize_typescript_1.Table({
        updatedAt: false,
        deletedAt: false,
    })
], Notification);
exports.Notification = Notification;
//# sourceMappingURL=Notification.js.map
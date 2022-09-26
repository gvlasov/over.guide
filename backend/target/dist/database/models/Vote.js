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
var Vote_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vote = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
const User_1 = require("./User");
const PostTypeId_1 = __importDefault(require("../../data/PostTypeId"));
let Vote = Vote_1 = class Vote extends sequelize_typescript_1.Model {
};
Vote.uniqueKeyName = 'vote_unique';
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Vote.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column({
        type: new sequelize_1.DataTypes.INTEGER(),
        unique: Vote_1.uniqueKeyName,
    }),
    __metadata("design:type", Number)
], Vote.prototype, "postId", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column({
        type: new sequelize_1.DataTypes.INTEGER(),
        unique: Vote_1.uniqueKeyName,
    }),
    __metadata("design:type", Number)
], Vote.prototype, "postTypeId", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.ForeignKey(() => User_1.User),
    sequelize_typescript_1.Column({
        unique: Vote_1.uniqueKeyName,
    }),
    __metadata("design:type", Number)
], Vote.prototype, "upvoterId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => User_1.User, 'upvoterId'),
    __metadata("design:type", User_1.User)
], Vote.prototype, "upvoter", void 0);
Vote = Vote_1 = __decorate([
    sequelize_typescript_1.Table({
        createdAt: false,
        updatedAt: false,
        indexes: [
            {
                fields: ['postTypeId', 'postId'],
            },
        ],
    })
], Vote);
exports.Vote = Vote;
//# sourceMappingURL=Vote.js.map
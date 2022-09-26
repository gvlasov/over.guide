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
var Report_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Report = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
const User_1 = require("./User");
const PostTypeId_1 = __importDefault(require("../../data/PostTypeId"));
const ReportReasonId_1 = __importDefault(require("../../data/ReportReasonId"));
const ReportReadDto_1 = __importDefault(require("../../data/dto/ReportReadDto"));
const Comment_1 = require("./Comment");
const GuideHead_1 = require("./GuideHead");
let Report = Report_1 = class Report extends sequelize_typescript_1.Model {
    static applyPosts(instances) {
        if (!Array.isArray(instances)) {
            instances = [instances];
        }
        for (const instance of instances) {
            if (instance.postTypeId === PostTypeId_1.default.Comment && instance.comment !== void 0) {
                instance.post = instance.comment;
            }
            else if (instance.postTypeId === PostTypeId_1.default.Guide && instance.head !== void 0) {
                instance.post = instance.head;
            }
            delete instance.comment;
            delete instance.dataValues.comment;
            delete instance.head;
            delete instance.dataValues.head;
        }
    }
    toDto() {
        return {
            id: this.id,
            postTypeId: this.postTypeId,
            postId: this.postId,
            reportReasonId: this.reportReasonId,
            createdAt: this.createdAt.toISOString(),
            post: this.post.toDto(),
            reporter: this.reporter.toDto(),
        };
    }
};
Report.uniqueKeyName = 'report_unique';
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Report.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column({
        type: new sequelize_1.DataTypes.INTEGER(),
        unique: Report_1.uniqueKeyName,
    }),
    __metadata("design:type", Number)
], Report.prototype, "postId", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column({
        type: new sequelize_1.DataTypes.INTEGER(),
        unique: Report_1.uniqueKeyName,
    }),
    __metadata("design:type", Number)
], Report.prototype, "postTypeId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => Comment_1.Comment, {
        foreignKey: 'postId',
        constraints: false,
        scope: {
            '$Report.postTypeId$': PostTypeId_1.default.Comment,
        },
    }),
    __metadata("design:type", Comment_1.Comment)
], Report.prototype, "comment", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => GuideHead_1.GuideHead, {
        foreignKey: 'postId',
        constraints: false,
        scope: {
            '$Report.postTypeId$': PostTypeId_1.default.Guide,
        },
    }),
    __metadata("design:type", GuideHead_1.GuideHead)
], Report.prototype, "head", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.ForeignKey(() => User_1.User),
    sequelize_typescript_1.Column({
        unique: Report_1.uniqueKeyName,
    }),
    __metadata("design:type", Number)
], Report.prototype, "reporterId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => User_1.User, 'reporterId'),
    __metadata("design:type", User_1.User)
], Report.prototype, "reporter", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column({
        type: new sequelize_1.DataTypes.INTEGER(),
    }),
    __metadata("design:type", Number)
], Report.prototype, "reportReasonId", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column({
        type: new sequelize_1.DataTypes.TINYINT({ unsigned: true, length: 1 }),
    }),
    __metadata("design:type", Number)
], Report.prototype, "handled", void 0);
__decorate([
    sequelize_typescript_1.AfterFind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], Report, "applyPosts", null);
Report = Report_1 = __decorate([
    sequelize_typescript_1.Table({
        updatedAt: false,
        scopes: {
            withContent: () => {
                return {
                    where: {
                        [sequelize_1.Op.or]: [
                            {
                                '$comment.id$': {
                                    [sequelize_1.Op.ne]: null
                                }
                            },
                            {
                                '$head.guideId$': {
                                    [sequelize_1.Op.ne]: null
                                }
                            }
                        ]
                    },
                    include: [
                        {
                            model: Comment_1.Comment.scope(['defaultScope', { method: ['votes', 'comment->votes'] }]),
                            as: 'comment',
                            required: false,
                            where: {
                                deactivatedAt: null,
                                deactivatedById: null
                            },
                        },
                        {
                            model: GuideHead_1.GuideHead,
                            as: 'head',
                            required: false,
                            include: GuideHead_1.GuideHead.includesForDto(),
                        }
                    ],
                    group: ['Report.postId', 'Report.postTypeId']
                };
            }
        }
    })
], Report);
exports.Report = Report;
//# sourceMappingURL=Report.js.map
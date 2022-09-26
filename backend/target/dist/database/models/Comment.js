"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var Comment_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = __importStar(require("sequelize"));
const PostTypeId_1 = __importDefault(require("../../data/PostTypeId"));
const User_1 = require("./User");
const AliveCommentReadDto_1 = __importDefault(require("../../data/dto/AliveCommentReadDto"));
const DeletedCommentReadDto_1 = __importDefault(require("../../data/dto/DeletedCommentReadDto"));
const Vote_1 = require("./Vote");
const CommentReadDto_1 = require("../../data/dto/CommentReadDto");
let Comment = Comment_1 = class Comment extends sequelize_typescript_1.Model {
    toDto() {
        if (this.deactivatedAt !== null) {
            return this.toDeletedDto();
        }
        else {
            return this.toAliveDto();
        }
    }
    toAliveDto() {
        return {
            ...this.toDeletedDto(),
            content: this.content,
            deleted: false,
        };
    }
    toDeletedDto() {
        return {
            id: this.id,
            author: this.author.toDto(),
            createdAt: this.createdAt.toISOString(),
            parentId: this.parentId,
            postId: this.postId,
            postType: this.postType,
            updatedAt: this.updatedAt.toISOString(),
            votesCount: this.votesCount,
            deleted: true,
        };
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Comment.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(true),
    sequelize_typescript_1.ForeignKey(() => Comment_1),
    sequelize_typescript_1.Column({ type: new sequelize_1.DataTypes.INTEGER() }),
    __metadata("design:type", Number)
], Comment.prototype, "parentId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => Comment_1),
    __metadata("design:type", Comment)
], Comment.prototype, "parent", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column({ type: new sequelize_1.DataTypes.INTEGER() }),
    __metadata("design:type", Number)
], Comment.prototype, "postId", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column({ type: new sequelize_1.DataTypes.INTEGER() }),
    __metadata("design:type", Number)
], Comment.prototype, "postType", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column({ type: new sequelize_1.DataTypes.TEXT() }),
    __metadata("design:type", String)
], Comment.prototype, "content", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.ForeignKey(() => User_1.User),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Comment.prototype, "authorId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => User_1.User, 'authorId'),
    __metadata("design:type", User_1.User)
], Comment.prototype, "author", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column({ type: new sequelize_1.DataTypes.DATE() }),
    __metadata("design:type", Date)
], Comment.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(false),
    sequelize_typescript_1.Column({ type: new sequelize_1.DataTypes.DATE() }),
    __metadata("design:type", Date)
], Comment.prototype, "updatedAt", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(true),
    sequelize_typescript_1.Column({ type: new sequelize_1.DataTypes.DATE() }),
    __metadata("design:type", Date)
], Comment.prototype, "deactivatedAt", void 0);
__decorate([
    sequelize_typescript_1.AllowNull(true),
    sequelize_typescript_1.ForeignKey(() => User_1.User),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Comment.prototype, "deactivatedById", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => User_1.User, 'deactivatedById'),
    __metadata("design:type", User_1.User)
], Comment.prototype, "deactivatedBy", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => Vote_1.Vote, {
        foreignKey: 'postId',
        constraints: false,
        scope: {
            postTypeId: PostTypeId_1.default.Comment,
        }
    }),
    __metadata("design:type", Array)
], Comment.prototype, "votes", void 0);
__decorate([
    sequelize_typescript_1.Column({
        type: new sequelize_1.DataTypes.VIRTUAL(sequelize_1.DataTypes.INTEGER)
    }),
    __metadata("design:type", Number)
], Comment.prototype, "votesCount", void 0);
Comment = Comment_1 = __decorate([
    sequelize_typescript_1.Table({
        deletedAt: false,
        defaultScope: {
            include: [
                {
                    model: User_1.User,
                    as: 'author',
                },
            ],
        },
        indexes: [
            {
                fields: ['postType', 'postId'],
            }
        ],
        scopes: {
            votes: (voteIdPath = 'votes') => {
                return {
                    attributes: {
                        include: [
                            [
                                sequelize_1.default.literal('count(`' + voteIdPath + '`.id)'),
                                'votesCount',
                            ],
                        ]
                    },
                    include: [
                        {
                            model: Vote_1.Vote,
                            as: 'votes',
                            attributes: [],
                        },
                    ],
                    group: ['id']
                };
            }
        }
    })
], Comment);
exports.Comment = Comment;
//# sourceMappingURL=Comment.js.map
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../services/auth.service");
const authenticated_guard_1 = require("../services/authenticated.guard");
const Comment_1 = require("../database/models/Comment");
const constants_1 = require("../constants");
const sequelize_typescript_1 = require("sequelize-typescript");
const CommentCreateDto_1 = __importDefault(require("../data/dto/CommentCreateDto"));
const CommentUpdateDto_1 = __importDefault(require("../data/dto/CommentUpdateDto"));
const sequelize_1 = require("sequelize");
const CommentReadDto_1 = require("../data/dto/CommentReadDto");
const restriction_service_1 = require("../services/restriction.service");
const RestrictionTypeId_1 = __importDefault(require("../data/RestrictionTypeId"));
const ApiErrorId_1 = __importDefault(require("../data/ApiErrorId"));
const NotificationTypeId_1 = __importDefault(require("../data/NotificationTypeId"));
const Guide_1 = require("../database/models/Guide");
const notification_service_1 = require("../services/notification.service");
let CommentController = class CommentController {
    constructor(sequelize, authService, restrictionService, notificationService) {
        this.sequelize = sequelize;
        this.authService = authService;
        this.restrictionService = restrictionService;
        this.notificationService = notificationService;
    }
    async getComments(postType, postId) {
        return Comment_1.Comment.scope(['defaultScope', 'votes']).findAll({
            where: {
                postType: postType,
                postId: postId,
            }
        })
            .then(comments => {
            return comments.map(comment => comment.toDto());
        });
    }
    async createComment(response, request, dto) {
        const user = await this.authService.getUser(request);
        if (await this.restrictionService.hasActiveRestriction(user, RestrictionTypeId_1.default.CommentCreationBan)) {
            response.status(common_1.HttpStatus.FORBIDDEN);
            response.send({ error: ApiErrorId_1.default.UserBannedFromCommenting });
        }
        else {
            const parentComment = await Comment_1.Comment.findOne({
                where: {
                    deactivatedById: {
                        [sequelize_1.Op.eq]: null,
                    },
                    deactivatedAt: {
                        [sequelize_1.Op.eq]: null,
                    },
                    id: dto.parentId,
                },
            });
            if (parentComment === null) {
                if (dto.parentId !== null) {
                    response.status(common_1.HttpStatus.NOT_FOUND);
                    response.send();
                    return;
                }
            }
            return Comment_1.Comment.create({
                ...dto,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                authorId: user.id,
            })
                .then(comment => Comment_1.Comment.findOne({ where: { id: comment.id } }))
                .then(async (comment) => {
                this.notificationService.notify(parentComment === null
                    ? (await Guide_1.Guide.findOne({
                        where: {
                            id: dto.postId
                        }
                    })).author
                    : parentComment.author, parentComment === null
                    ? NotificationTypeId_1.default.GuideReply
                    : NotificationTypeId_1.default.CommentReply, comment.toAliveDto());
                return comment;
            })
                .then(comment => {
                response.status(common_1.HttpStatus.CREATED);
                response.send(comment.toDto());
            });
        }
    }
    async editCommentOnGuide(response, request, dto) {
        const user = await this.authService.getUser(request);
        if (await this.restrictionService.hasActiveRestriction(user, RestrictionTypeId_1.default.CommentCreationBan)) {
            response.status(common_1.HttpStatus.FORBIDDEN);
            response.send({ error: ApiErrorId_1.default.UserBannedFromCommenting });
        }
        else {
            const minDate = new Date();
            minDate.setMinutes(minDate.getMinutes() - 30);
            Comment_1.Comment.update({
                ...dto,
                updatedAt: new Date().toISOString(),
            }, {
                where: {
                    id: dto.id,
                    authorId: user.id,
                    deactivatedById: null,
                    deactivatedAt: null,
                    createdAt: {
                        [sequelize_1.Op.gt]: minDate.toISOString()
                    }
                },
            })
                .then(comment => {
                if (comment[0] === 0) {
                    response.status(common_1.HttpStatus.UNPROCESSABLE_ENTITY);
                    response.send();
                }
                else {
                    response.status(common_1.HttpStatus.ACCEPTED);
                    response.send();
                }
            });
        }
    }
    async deleteComment(response, request, id) {
        this.authService.getUser(request)
            .then(user => Comment_1.Comment.update({
            deactivatedById: user.id,
            deactivatedAt: new Date().toISOString(),
        }, {
            where: {
                id: id,
                authorId: user.id,
            },
        }))
            .then(deletedCount => {
            if (deletedCount[0] === 0) {
                response.status(common_1.HttpStatus.UNPROCESSABLE_ENTITY);
                response.send();
            }
            else {
                response.status(common_1.HttpStatus.OK);
                response.send();
            }
        });
    }
};
__decorate([
    common_1.Get(':postType/:postId'),
    __param(0, common_1.Param('postType')),
    __param(1, common_1.Param('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "getComments", null);
__decorate([
    common_1.Post('create'),
    common_1.UseGuards(authenticated_guard_1.AuthenticatedGuard),
    __param(0, common_1.Res()),
    __param(1, common_1.Req()),
    __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "createComment", null);
__decorate([
    common_1.Post('edit'),
    common_1.UseGuards(authenticated_guard_1.AuthenticatedGuard),
    __param(0, common_1.Res()),
    __param(1, common_1.Req()),
    __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "editCommentOnGuide", null);
__decorate([
    common_1.Delete(':id'),
    common_1.UseGuards(authenticated_guard_1.AuthenticatedGuard),
    __param(0, common_1.Res()),
    __param(1, common_1.Req()),
    __param(2, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Number]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "deleteComment", null);
CommentController = __decorate([
    common_1.Controller('comment'),
    __param(0, common_1.Inject(constants_1.SEQUELIZE)),
    __metadata("design:paramtypes", [sequelize_typescript_1.Sequelize,
        auth_service_1.AuthService,
        restriction_service_1.RestrictionService,
        notification_service_1.NotificationService])
], CommentController);
exports.CommentController = CommentController;
//# sourceMappingURL=comment.controller.js.map
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
exports.SentenceController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../services/auth.service");
const moderator_guard_1 = require("../services/moderator.guard");
const SentenceCreateDto_1 = __importDefault(require("../data/dto/SentenceCreateDto"));
const constants_1 = require("../constants");
const sequelize_typescript_1 = require("sequelize-typescript");
const Sentence_1 = require("../database/models/Sentence");
const Restriction_1 = require("../database/models/Restriction");
const Notification_1 = require("../database/models/Notification");
const ImmediateAction_1 = require("../database/models/ImmediateAction");
const sentence_immediate_action_service_1 = require("../services/sentence-immediate-action.service");
const NotificationTypeId_1 = __importDefault(require("../data/NotificationTypeId"));
const online_users_repository_1 = require("../services/online-users.repository");
const notification_service_1 = require("../services/notification.service");
let SentenceController = class SentenceController {
    constructor(authService, sequelize, actionService, notificationService, onlineUsersRepository) {
        this.authService = authService;
        this.sequelize = sequelize;
        this.actionService = actionService;
        this.notificationService = notificationService;
        this.onlineUsersRepository = onlineUsersRepository;
    }
    async create(request, response, dto) {
        this.authService.getUser(request)
            .then(judge => {
            return this.sequelize.transaction(() => {
                return Sentence_1.Sentence.create({
                    ...dto,
                    judgeId: judge.id,
                })
                    .then(sentence => {
                    return Restriction_1.Restriction.bulkCreate(dto.restrictions.map(restrictionDto => {
                        return {
                            ...restrictionDto,
                            sentenceId: sentence.id,
                        };
                    }))
                        .then(() => {
                        return this.actionService.issueActions(judge, sentence, dto.immediateActions);
                    })
                        .then(async () => {
                        const notification = await Notification_1.Notification.create({
                            userId: dto.defenderId,
                            notificationTypeId: NotificationTypeId_1.default.SentenceCreated,
                            json: JSON.stringify(dto),
                            read: 0,
                        });
                        notification.toDto();
                        return notification;
                    });
                });
            });
        })
            .then(() => {
            response.status(common_1.HttpStatus.OK);
            response.send();
        });
    }
    async edit(request, response, sentenceId, dto) {
        this.authService.getUser(request)
            .then(judge => {
            return this.sequelize.transaction(() => {
                return Sentence_1.Sentence.update({
                    ...dto,
                    judgeId: judge.id,
                }, {
                    where: {
                        id: sentenceId,
                    },
                })
                    .then(async (result) => {
                    if (result[0] === 0) {
                        response.status(common_1.HttpStatus.NOT_FOUND);
                        response.send();
                    }
                    else {
                        const sentence = await Sentence_1.Sentence.findOne({ where: { id: sentenceId } });
                        await Restriction_1.Restriction.destroy({
                            where: {
                                sentenceId: sentenceId,
                            },
                            force: true,
                        });
                        const existingKeys = {};
                        for (let action of (await ImmediateAction_1.ImmediateAction.findAll({
                            where: {
                                sentenceId: sentenceId,
                            },
                        }))) {
                            if (!existingKeys.hasOwnProperty(action.typeId)) {
                                existingKeys[action.typeId] = [];
                            }
                            existingKeys[action.typeId].push(action.objectId);
                        }
                        return Restriction_1.Restriction.bulkCreate(dto.restrictions.map(restrictionDto => {
                            return {
                                ...restrictionDto,
                                sentenceId: sentenceId,
                            };
                        }))
                            .then(() => {
                            return this.actionService.issueActions(judge, sentence, dto.immediateActions
                                .filter(dto => {
                                return !existingKeys.hasOwnProperty(dto.typeId) ||
                                    !existingKeys[dto.typeId].includes(dto.objectId);
                            }));
                        })
                            .then(() => {
                            response.status(common_1.HttpStatus.OK);
                            response.send();
                        });
                    }
                });
            });
        });
    }
};
__decorate([
    common_1.Put(),
    common_1.UseGuards(moderator_guard_1.ModeratorGuard),
    __param(0, common_1.Req()),
    __param(1, common_1.Res()),
    __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SentenceController.prototype, "create", null);
__decorate([
    common_1.Put('edit/:id'),
    common_1.UseGuards(moderator_guard_1.ModeratorGuard),
    __param(0, common_1.Req()),
    __param(1, common_1.Res()),
    __param(2, common_1.Param('id')),
    __param(3, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Number, Object]),
    __metadata("design:returntype", Promise)
], SentenceController.prototype, "edit", null);
SentenceController = __decorate([
    common_1.Controller('sentence'),
    __param(1, common_1.Inject(constants_1.SEQUELIZE)),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        sequelize_typescript_1.Sequelize,
        sentence_immediate_action_service_1.SentenceImmediateActionService,
        notification_service_1.NotificationService,
        online_users_repository_1.OnlineUsersRepository])
], SentenceController);
exports.SentenceController = SentenceController;
//# sourceMappingURL=sentence.controller.js.map
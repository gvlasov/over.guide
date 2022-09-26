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
exports.SentenceImmediateActionService = void 0;
const common_1 = require("@nestjs/common");
const Sentence_1 = require("../database/models/Sentence");
const ImmediateActionCreateDto_1 = __importDefault(require("../data/dto/ImmediateActionCreateDto"));
const ImmediateAction_1 = require("../database/models/ImmediateAction");
const ImmediateActionTypeId_1 = __importDefault(require("../data/ImmediateActionTypeId"));
const Guide_1 = require("../database/models/Guide");
const Comment_1 = require("../database/models/Comment");
const User_1 = require("../database/models/User");
const PostTypeId_1 = __importDefault(require("../data/PostTypeId"));
const Report_1 = require("../database/models/Report");
let SentenceImmediateActionService = class SentenceImmediateActionService {
    constructor() {
    }
    issueActions(issuer, sentence, actions) {
        return Promise.all(actions.map(dto => {
            let promise;
            if (dto.typeId === ImmediateActionTypeId_1.default.DeactivateAllGuides) {
                promise = this.deactivateAllGuides(issuer, sentence);
            }
            else if (dto.typeId === ImmediateActionTypeId_1.default.DeactivateGuide) {
                promise = this.deactivateGuide(sentence, dto);
            }
            else if (dto.typeId === ImmediateActionTypeId_1.default.DeleteAllGuideComments) {
                promise = this.deleteAllGuideComments(sentence);
            }
            else if (dto.typeId === ImmediateActionTypeId_1.default.DeleteComment) {
                promise = this.deleteComment(sentence, dto);
            }
            else if (dto.typeId === ImmediateActionTypeId_1.default.IgnoreAllCurrentReports) {
                promise = this.ignoreAllCurrentReports(sentence);
            }
            else if (dto.typeId === ImmediateActionTypeId_1.default.BanAccount) {
                promise = this.banAccount(sentence);
            }
            else if (dto.typeId === ImmediateActionTypeId_1.default.MakeGuidePrivate) {
                promise = this.makeGuidePrivate(sentence, dto);
            }
            else {
                throw new Error('Unknown action type');
            }
            return promise
                .then(success => {
                if (success) {
                    return dto;
                }
                else {
                    return null;
                }
            });
        }))
            .then(dtos => {
            return ImmediateAction_1.ImmediateAction.bulkCreate(dtos
                .filter(dto => dto !== null)
                .map(dto => {
                return {
                    ...dto,
                    sentenceId: sentence.id,
                };
            }));
        })
            .then(() => void 0);
    }
    deactivateAllGuides(issuer, sentence) {
        return Guide_1.Guide.update({
            deactivatedById: issuer.id,
            deactivatedAt: new Date().toISOString(),
        }, {
            where: {
                authorId: sentence.defenderId,
                deactivatedById: null,
                deactivatedAt: null,
            },
        })
            .then(() => Guide_1.Guide.findAll({
            where: {
                authorId: sentence.defenderId,
            },
            paranoid: false,
        }))
            .then(guides => Report_1.Report.update({
            handled: 1,
        }, {
            where: {
                postTypeId: PostTypeId_1.default.Guide,
                postId: guides.map(g => g.id),
                handled: 0,
            },
        }))
            .then(() => true);
    }
    deactivateGuide(sentence, dto) {
        return Guide_1.Guide.update({
            deactivatedById: sentence.judgeId,
            deactivatedAt: new Date().toISOString(),
        }, {
            where: {
                authorId: sentence.defenderId,
                id: dto.objectId,
            },
        })
            .then((guideUpdateResult) => {
            return Report_1.Report.update({
                handled: 1,
            }, {
                where: {
                    postTypeId: PostTypeId_1.default.Guide,
                    postId: dto.objectId,
                    handled: 0,
                }
            })
                .then(() => guideUpdateResult);
        })
            .then(result => result[0] === 1);
    }
    deleteAllGuideComments(sentence) {
        return Comment_1.Comment.update({
            deactivatedById: sentence.judgeId,
            deactivatedAt: new Date().toISOString()
        }, {
            where: {
                postType: PostTypeId_1.default.Guide,
                authorId: sentence.defenderId,
                deactivatedById: null,
                deactivatedAt: null,
            }
        })
            .then(() => Comment_1.Comment.findAll({
            where: {
                postType: PostTypeId_1.default.Guide,
                authorId: sentence.defenderId,
            }
        }))
            .then(comments => {
            Report_1.Report.update({
                handled: 1,
            }, {
                where: {
                    postTypeId: PostTypeId_1.default.Comment,
                    postId: comments.map(c => c.id),
                    handled: 0,
                }
            });
        })
            .then(() => true);
    }
    deleteComment(sentence, dto) {
        return Comment_1.Comment.update({
            deactivatedById: sentence.judgeId,
            deactivatedAt: new Date().toISOString()
        }, {
            where: {
                id: dto.objectId,
                authorId: sentence.defenderId,
                deactivatedById: null,
                deactivatedAt: null,
            }
        })
            .then((result) => {
            if (result[0] === 1) {
                return Report_1.Report.update({
                    handled: 1,
                }, {
                    where: {
                        postTypeId: PostTypeId_1.default.Comment,
                        postId: dto.objectId,
                        handled: 0,
                    }
                })
                    .then(() => result);
            }
            else {
                return new Promise((resolve) => { resolve(result); });
            }
        })
            .then(result => result[0] === 1);
    }
    ignoreAllCurrentReports(sentence) {
        return Report_1.Report.update({
            handled: 1,
        }, {
            where: {
                reporterId: sentence.defenderId,
                handled: 0,
            }
        })
            .then(() => true);
    }
    banAccount(sentence) {
        return User_1.User.update({
            banned: 1,
        }, {
            where: {
                banned: 0,
                id: sentence.defenderId,
            }
        })
            .then(result => result[0] === 1);
    }
    makeGuidePrivate(sentence, dto) {
        return Guide_1.Guide.update({
            isPublic: 0
        }, {
            where: {
                id: dto.objectId,
                authorId: sentence.defenderId,
            }
        })
            .then(result => result[0] === 1);
    }
};
SentenceImmediateActionService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [])
], SentenceImmediateActionService);
exports.SentenceImmediateActionService = SentenceImmediateActionService;
//# sourceMappingURL=sentence-immediate-action.service.js.map
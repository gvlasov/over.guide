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
exports.MatchupEvaluationController = void 0;
const common_1 = require("@nestjs/common");
const MatchupEvaluation_1 = require("../database/models/MatchupEvaluation");
const MatchupEvaluationDto_1 = __importDefault(require("../data/dto/MatchupEvaluationDto"));
const auth_service_1 = require("../services/auth.service");
const User_1 = require("../database/models/User");
const Patch_1 = require("../database/models/Patch");
const authenticated_guard_1 = require("../services/authenticated.guard");
const sequelize_1 = require("sequelize");
let MatchupEvaluationController = class MatchupEvaluationController {
    constructor(authService) {
        this.authService = authService;
    }
    async createEvaluation(response, request, dtos) {
        const currentUser = await this.authService.getUser(request);
        const patch = await Patch_1.Patch.findOne({
            order: [['date', 'DESC']]
        });
        for (let dto of dtos) {
            if (dto.score === null) {
                await MatchupEvaluation_1.MatchupEvaluation.destroy({
                    where: {
                        createdById: currentUser.id,
                        subjectId: dto.subjectId,
                        objectId: dto.objectId,
                        patchId: patch.id
                    }
                });
            }
            else {
                const existingEvaluation = await MatchupEvaluation_1.MatchupEvaluation.findOne({
                    where: {
                        createdById: currentUser.id,
                        subjectId: dto.subjectId,
                        objectId: dto.objectId,
                        patchId: patch.id
                    }
                });
                if (existingEvaluation === null) {
                    await MatchupEvaluation_1.MatchupEvaluation.create({
                        subjectId: dto.subjectId,
                        objectId: dto.objectId,
                        score: dto.score,
                        createdById: currentUser.id,
                        ip: request.ip,
                        patchId: patch.id,
                    });
                }
                else {
                    await existingEvaluation.update({
                        subjectId: dto.subjectId,
                        objectId: dto.objectId,
                        score: dto.score,
                        createdById: currentUser.id,
                        ip: request.ip,
                        patchId: patch.id,
                    });
                }
            }
        }
        response.status(common_1.HttpStatus.OK);
        response.send();
    }
    async removeEvaluations(response, request, oppositions) {
        const currentUser = await this.authService.getUser(request);
        const patch = await Patch_1.Patch.findOne({
            order: [['date', 'DESC']]
        });
        await MatchupEvaluation_1.MatchupEvaluation.destroy({
            where: {
                [sequelize_1.Op.and]: [
                    {
                        [sequelize_1.Op.or]: oppositions.map(o => {
                            return {
                                subjectId: o[0],
                                objectId: o[1]
                            };
                        })
                    },
                    {
                        createdById: currentUser.id,
                        patchId: patch.id,
                    }
                ]
            },
            force: true,
        });
        response.status(common_1.HttpStatus.OK);
        response.send();
    }
    async myEvaluations(request) {
        const currentUser = await this.authService.getUser(request);
        return MatchupEvaluation_1.MatchupEvaluation.findAll({
            where: {
                createdById: currentUser.id
            },
        })
            .then(evaluations => evaluations.map(evaluation => evaluation.toDto()));
    }
};
__decorate([
    common_1.UseGuards(authenticated_guard_1.AuthenticatedGuard),
    common_1.Put(),
    __param(0, common_1.Res()),
    __param(1, common_1.Req()),
    __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Array]),
    __metadata("design:returntype", Promise)
], MatchupEvaluationController.prototype, "createEvaluation", null);
__decorate([
    common_1.UseGuards(authenticated_guard_1.AuthenticatedGuard),
    common_1.Post('remove'),
    __param(0, common_1.Res()),
    __param(1, common_1.Req()),
    __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Array]),
    __metadata("design:returntype", Promise)
], MatchupEvaluationController.prototype, "removeEvaluations", null);
__decorate([
    common_1.UseGuards(authenticated_guard_1.AuthenticatedGuard),
    common_1.Get('my'),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MatchupEvaluationController.prototype, "myEvaluations", null);
MatchupEvaluationController = __decorate([
    common_1.Controller('matchup-evaluation'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], MatchupEvaluationController);
exports.MatchupEvaluationController = MatchupEvaluationController;
//# sourceMappingURL=matchup-evaluation.controller.js.map
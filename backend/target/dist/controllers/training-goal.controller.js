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
exports.TrainingGoalController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../services/auth.service");
const authenticated_guard_1 = require("../services/authenticated.guard");
const Guide_1 = require("../database/models/Guide");
const User2TrainingGoal_1 = require("../database/models/User2TrainingGoal");
const sequelize_typescript_1 = require("sequelize-typescript");
const constants_1 = require("../constants");
const sequelize_1 = require("sequelize");
const AddAndReorderTrainingGoalDto_1 = __importDefault(require("../data/dto/AddAndReorderTrainingGoalDto"));
const lodash_xor_1 = __importDefault(require("lodash.xor"));
const GuideHead_1 = require("../database/models/GuideHead");
const OrderedGuideHeadDto_1 = __importDefault(require("../data/dto/OrderedGuideHeadDto"));
let TrainingGoalController = class TrainingGoalController {
    constructor(sequelize, authService) {
        this.sequelize = sequelize;
        this.authService = authService;
    }
    async myTrainingGoals(request) {
        const user = await this.authService.getUser(request);
        return GuideHead_1.GuideHead.findAll({
            include: [
                ...GuideHead_1.GuideHead.includesForDto(),
                {
                    model: User2TrainingGoal_1.User2TrainingGoal,
                    as: 'user2TrainingGoal',
                    required: true,
                    on: {
                        '$user2TrainingGoal.guideId$': {
                            [sequelize_1.Op.col]: 'GuideHead.guideId'
                        }
                    },
                    where: {
                        userId: user.id
                    }
                },
            ],
            order: [
                ['user2TrainingGoal', 'order', 'DESC']
            ]
        })
            .then(guideHeads => guideHeads.map(h => {
            return {
                ...h.toDto(),
                order: h.user2TrainingGoal.order
            };
        }));
    }
    async delete(request, response, params) {
        const user = await this.authService.getUser(request);
        await User2TrainingGoal_1.User2TrainingGoal.destroy({
            where: {
                userId: user.id,
                guideId: params.id,
            },
            force: true,
        });
        response.status(common_1.HttpStatus.NO_CONTENT);
        response.send();
    }
    async reorder(request, response) {
        const user = await this.authService.getUser(request);
        const newOrderedGuideIds = request.body;
        await User2TrainingGoal_1.User2TrainingGoal.findAll({
            where: {
                userId: user.id
            }
        })
            .then(async (goals) => {
            if (newOrderedGuideIds.length !== goals.length) {
                response.status(common_1.HttpStatus.UNPROCESSABLE_ENTITY);
                response.send();
                return;
            }
            const updatedGoals = [];
            for (let goal of goals) {
                const newOrder = goals.length - newOrderedGuideIds.indexOf(goal.guideId);
                if (newOrder === -1) {
                    response.status(common_1.HttpStatus.UNPROCESSABLE_ENTITY);
                    response.send();
                    return;
                }
                if (goal.order !== newOrder) {
                    updatedGoals.push(goal);
                    goal.order = newOrder;
                }
            }
            const saves = [];
            for (let goal of updatedGoals) {
                saves.push(goal.save());
            }
            Promise.all(saves)
                .then(() => {
                response.status(common_1.HttpStatus.NO_CONTENT);
                response.send();
            });
        });
    }
    async addAndReorder(request, response) {
        const user = await this.authService.getUser(request);
        const dto = request.body;
        if (!dto.newGoalsOrder.includes(dto.newGoalId)) {
            response.status(common_1.HttpStatus.UNPROCESSABLE_ENTITY);
            response.send();
            return;
        }
        User2TrainingGoal_1.User2TrainingGoal.findAll({
            where: {
                userId: user.id,
                guideId: dto.newGoalsOrder,
            }
        })
            .then(async (goals) => {
            if (lodash_xor_1.default([...goals.map(g => g.guideId), dto.newGoalId], dto.newGoalsOrder).length !== 0) {
                response.status(common_1.HttpStatus.UNPROCESSABLE_ENTITY);
                response.send({ clientAndServerContentDiffer: true });
                return;
            }
            const goalSaves = [];
            for (let goal of goals) {
                goal.order = dto.newGoalsOrder.length - dto.newGoalsOrder.indexOf(goal.guideId) - 1;
                goalSaves.push(goal.save());
            }
            return Promise.all([
                ...goalSaves,
                User2TrainingGoal_1.User2TrainingGoal.create({
                    userId: user.id,
                    guideId: dto.newGoalId,
                    order: dto.newGoalsOrder.length - dto.newGoalsOrder.indexOf(dto.newGoalId) - 1
                })
            ])
                .then(() => {
                response.status(common_1.HttpStatus.NO_CONTENT);
                response.send();
            });
        });
    }
    async add(request, response, params) {
        const guide = await Guide_1.Guide.findOne({
            where: {
                id: params.id
            }
        });
        if (guide === null) {
            throw new common_1.NotFoundException();
        }
        const user = await this.authService.getUser(request);
        let order = request.body.order;
        await this.sequelize.query(`
                    SELECT \`order\`, guideId
                    from User2TrainingGoal
                    where userId = :userId
            `, {
            raw: true,
            type: sequelize_1.QueryTypes.SELECT,
            replacements: {
                userId: user.id,
            }
        })
            .then(async (rows) => {
            if (rows.find(r => r.guideId === guide.id)) {
                response.status(common_1.HttpStatus.OK);
                response.send('already added');
                return;
            }
            const orders = rows.map(r => r.order);
            if (typeof order !== 'undefined') {
                let indexOfOrder = orders.indexOf(order);
                if (indexOfOrder !== -1) {
                    do {
                        indexOfOrder++;
                    } while (indexOfOrder !== orders.length && orders[indexOfOrder] !== orders[indexOfOrder - 1] + 1);
                    order = orders[indexOfOrder - 1] + 1;
                }
            }
            else if (orders.length === 0) {
                order = 0;
            }
            else {
                order = Math.max(...orders) + 1;
            }
            return User2TrainingGoal_1.User2TrainingGoal.create({
                userId: user.id,
                guideId: guide.id,
                order: order
            })
                .then(() => {
                response.status(common_1.HttpStatus.CREATED);
                response.send();
            });
        });
    }
};
__decorate([
    common_1.Get(),
    common_1.UseGuards(authenticated_guard_1.AuthenticatedGuard),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TrainingGoalController.prototype, "myTrainingGoals", null);
__decorate([
    common_1.Delete(':id'),
    common_1.UseGuards(authenticated_guard_1.AuthenticatedGuard),
    __param(0, common_1.Req()),
    __param(1, common_1.Res()),
    __param(2, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], TrainingGoalController.prototype, "delete", null);
__decorate([
    common_1.Post('reorder'),
    common_1.UseGuards(authenticated_guard_1.AuthenticatedGuard),
    __param(0, common_1.Req()),
    __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TrainingGoalController.prototype, "reorder", null);
__decorate([
    common_1.Post('add-and-reorder'),
    common_1.UseGuards(authenticated_guard_1.AuthenticatedGuard),
    __param(0, common_1.Req()),
    __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TrainingGoalController.prototype, "addAndReorder", null);
__decorate([
    common_1.Post(':id'),
    common_1.UseGuards(authenticated_guard_1.AuthenticatedGuard),
    __param(0, common_1.Req()),
    __param(1, common_1.Res()),
    __param(2, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], TrainingGoalController.prototype, "add", null);
TrainingGoalController = __decorate([
    common_1.Controller('my-training-goals'),
    __param(0, common_1.Inject(constants_1.SEQUELIZE)),
    __metadata("design:paramtypes", [sequelize_typescript_1.Sequelize,
        auth_service_1.AuthService])
], TrainingGoalController);
exports.TrainingGoalController = TrainingGoalController;
//# sourceMappingURL=training-goal.controller.js.map
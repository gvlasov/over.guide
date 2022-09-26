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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../services/auth.service");
const authenticated_guard_1 = require("../services/authenticated.guard");
const sequelize_typescript_1 = require("sequelize-typescript");
const constants_1 = require("../constants");
const User_1 = require("../database/models/User");
const guide_search_service_1 = require("../services/guide-search.service");
const UsernameChangeDto_1 = __importDefault(require("../data/dto/UsernameChangeDto"));
const sequelize_1 = require("sequelize");
let UserController = class UserController {
    constructor(sequelize, searchService, authService) {
        this.sequelize = sequelize;
        this.searchService = searchService;
        this.authService = authService;
    }
    async get(userId, response, request) {
        const requester = await this.authService.getUser(request);
        const scopes = ['defaultScope', 'withVotesCount'];
        const isSelf = requester !== null && requester.id === Number.parseInt(userId);
        if (isSelf) {
            scopes.push('activeRestrictions');
        }
        User_1.User.scope(scopes).findOne({
            where: {
                id: userId
            },
        })
            .then(async (user) => {
            if (user === null) {
                response.status(common_1.HttpStatus.NOT_FOUND);
                response.send();
            }
            else {
                response.status(common_1.HttpStatus.OK);
                let privatePart;
                if (isSelf) {
                    privatePart = {
                        restrictions: user.sentences.flatMap(s => s.restrictions).map(r => r.toDto()),
                    };
                }
                else {
                    privatePart = {};
                }
                response.send({
                    user: user.toDto(),
                    lastAuthoredGuides: await this.searchService.searchByAuthor({
                        authorId: userId,
                        clientAlreadyHasGuideIds: [],
                    }),
                    guideVotesReceivedCount: user.guideVotesReceivedCount,
                    ...privatePart
                });
            }
        });
    }
    changeUsername(request, response, usernameChange) {
        if (!usernameChange.newUsername) {
            response.status(common_1.HttpStatus.BAD_REQUEST);
            response.send();
        }
        this.authService.getUser(request)
            .then(user => {
            if (usernameChange.newUsername.length < 3 || usernameChange.newUsername.length > 12) {
                response.status(common_1.HttpStatus.UNPROCESSABLE_ENTITY);
                response.send();
            }
            else {
                User_1.User.update({
                    name: usernameChange.newUsername,
                }, {
                    where: {
                        id: user.id,
                    },
                })
                    .then(result => {
                    response.status(common_1.HttpStatus.NO_CONTENT);
                    response.send();
                })
                    .catch(e => {
                    if (e instanceof sequelize_1.ValidationError) {
                        response.status(common_1.HttpStatus.UNPROCESSABLE_ENTITY);
                        response.send();
                    }
                    else {
                        throw e;
                    }
                });
            }
        });
    }
};
__decorate([
    common_1.Get(':id'),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Res()),
    __param(2, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "get", null);
__decorate([
    common_1.UseGuards(authenticated_guard_1.AuthenticatedGuard),
    common_1.Post('change-username'),
    __param(0, common_1.Req()),
    __param(1, common_1.Res()),
    __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "changeUsername", null);
UserController = __decorate([
    common_1.Controller('user'),
    __param(0, common_1.Inject(constants_1.SEQUELIZE)),
    __metadata("design:paramtypes", [sequelize_typescript_1.Sequelize,
        guide_search_service_1.GuideSearchService,
        auth_service_1.AuthService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map
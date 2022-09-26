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
exports.VoteController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../services/auth.service");
const authenticated_guard_1 = require("../services/authenticated.guard");
const Vote_1 = require("../database/models/Vote");
const VoteDto_1 = __importDefault(require("../data/dto/VoteDto"));
let VoteController = class VoteController {
    constructor(authService) {
        this.authService = authService;
    }
    async upvote(response, request, dto) {
        this.authService.getUser(request)
            .then(user => Vote_1.Vote.create({
            ...dto,
            upvoterId: user.id,
        }))
            .then(vote => {
            response.status(common_1.HttpStatus.OK);
            response.send();
        })
            .catch(e => {
            if (e.errors[0].type === 'unique violation') {
                response.status(common_1.HttpStatus.UNPROCESSABLE_ENTITY);
                response.send();
            }
            else {
                throw e;
            }
        });
    }
    async removeUpvote(response, request, dto) {
        this.authService.getUser(request)
            .then(user => Vote_1.Vote.destroy({
            where: {
                ...dto,
                upvoterId: user.id,
            },
        }))
            .then(count => {
            if (count === 0) {
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
    common_1.Put(),
    common_1.UseGuards(authenticated_guard_1.AuthenticatedGuard),
    __param(0, common_1.Res()),
    __param(1, common_1.Req()),
    __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], VoteController.prototype, "upvote", null);
__decorate([
    common_1.Delete(),
    common_1.UseGuards(authenticated_guard_1.AuthenticatedGuard),
    __param(0, common_1.Res()),
    __param(1, common_1.Req()),
    __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], VoteController.prototype, "removeUpvote", null);
VoteController = __decorate([
    common_1.Controller('vote'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], VoteController);
exports.VoteController = VoteController;
//# sourceMappingURL=vote.controller.js.map
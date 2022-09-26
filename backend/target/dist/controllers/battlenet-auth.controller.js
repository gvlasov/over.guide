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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BattlenetAuthController = void 0;
const common_1 = require("@nestjs/common");
const battlenet_service_1 = require("../services/battlenet.service");
const User_1 = require("../database/models/User");
const token_service_1 = require("../services/token.service");
let BattlenetAuthController = class BattlenetAuthController {
    constructor(battlenet, tokenService) {
        this.battlenet = battlenet;
        this.tokenService = tokenService;
    }
    async logIn(code, response, request) {
        this.battlenet.obtainToken(code)
            .then(token => this.battlenet.userInfo(token))
            .then((userInfo) => {
            if (typeof userInfo.battletag === "undefined") {
                throw new Error(`Empty battletag on account ${JSON.stringify(userInfo)}`);
            }
            return User_1.User.findOne({ where: { battleNetUserId: userInfo.id } })
                .then(async (user) => {
                if (user === null) {
                    return User_1.User.create({
                        battleNetUserId: userInfo.id,
                        name: userInfo.battletag,
                        banned: 0,
                    });
                }
                else {
                    return user;
                }
            });
        })
            .then((user) => {
            const cookieOptions = {
                expires: new Date('Tue, 19 Jan 2038 03:14:07 GMT'),
                path: '/',
                domain: process.env.COOKIE_DOMAIN,
            };
            response.cookie('auth-token', this.tokenService.getToken(user), cookieOptions);
            response.cookie('username', user.name, cookieOptions);
            response.cookie('userId', user.id, cookieOptions);
            response.redirect(process.env.FRONTEND_ROOT_URL);
        });
    }
};
__decorate([
    common_1.Get(),
    __param(0, common_1.Query('code')),
    __param(1, common_1.Res()),
    __param(2, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], BattlenetAuthController.prototype, "logIn", null);
BattlenetAuthController = __decorate([
    common_1.Controller('battlenet-auth'),
    __metadata("design:paramtypes", [battlenet_service_1.BattlenetService,
        token_service_1.TokenService])
], BattlenetAuthController);
exports.BattlenetAuthController = BattlenetAuthController;
//# sourceMappingURL=battlenet-auth.controller.js.map
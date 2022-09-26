"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const common_1 = require("@nestjs/common");
const User_1 = require("../database/models/User");
let TokenService = class TokenService {
    constructor() {
        this.CryptoJS = require('crypto-js');
    }
    getToken(user) {
        return this.CryptoJS.Rabbit.encrypt(user.battleNetUserId.toString(), process.env.TOKEN_CIPHER_SECRET).toString();
    }
    async getUser(token) {
        try {
            return User_1.User.findOne({
                where: {
                    battleNetUserId: this.getBattleNetUserId(token)
                },
            });
        }
        catch (e) {
            return null;
        }
    }
    getBattleNetUserId(token) {
        return this.CryptoJS.Rabbit
            .decrypt(token, process.env.TOKEN_CIPHER_SECRET)
            .toString(this.CryptoJS.enc.Utf8);
    }
};
TokenService = __decorate([
    common_1.Injectable()
], TokenService);
exports.TokenService = TokenService;
//# sourceMappingURL=token.service.js.map
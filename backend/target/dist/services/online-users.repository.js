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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnlineUsersRepository = void 0;
const common_1 = require("@nestjs/common");
const token_service_1 = require("./token.service");
const User_1 = require("../database/models/User");
let OnlineUsersRepository = class OnlineUsersRepository {
    constructor(tokenService) {
        this.tokenService = tokenService;
        this.token2Client = {};
        this.clientId2Token = {};
        this.userId2Token = {};
    }
    saveClient(token, client) {
        this.clientId2Token[client.id] = token;
        this.token2Client[token] = client;
        const userId = this.tokenService.getBattleNetUserId(token);
        this.userId2Token[userId] = token;
        console.log('connect', client.id, 'with token', token);
    }
    removeClient(client) {
        console.log('disconnect', client.id);
        delete this.token2Client[this.clientId2Token[client.id]];
        delete this.clientId2Token[client.id];
    }
    async getUser(client) {
        return this.tokenService.getUser(this.clientId2Token[client.id])
            .then(user => {
            if (user === null) {
                throw new Error('No user for client ' + client.id);
            }
            return user;
        });
    }
    getClient(user) {
        const token = this.userId2Token[user.battleNetUserId];
        const client = this.token2Client[token];
        if (client === void 0) {
            throw new Error('No client with token ' + token);
        }
        return client;
    }
};
OnlineUsersRepository = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [token_service_1.TokenService])
], OnlineUsersRepository);
exports.OnlineUsersRepository = OnlineUsersRepository;
//# sourceMappingURL=online-users.repository.js.map
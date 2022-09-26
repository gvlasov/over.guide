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
exports.BattlenetService = void 0;
const common_1 = require("@nestjs/common");
let BattlenetService = class BattlenetService {
    constructor(httpService) {
        this.httpService = httpService;
        this.querystring = require('querystring');
    }
    async obtainToken(code) {
        const authorization = 'Basic ' +
            Buffer.from(process.env.BATTLE_NET_CLIENT_ID + ':' + process.env.BATTLE_NET_CLIENT_SECRET, 'binary')
                .toString('base64');
        return await this.httpService.post('https://eu.battle.net/oauth/token', this.querystring.stringify({
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': process.env.BATTLE_NET_REDIRECT_URI,
            'client_id': process.env.BATTLE_NET_CLIENT_ID,
            'client_secret': process.env.BATTLE_NET_CLIENT_SECRET,
        }), {
            headers: {
                'Authorization': authorization
            },
        })
            .toPromise()
            .then(response => {
            return response.data.access_token;
        })
            .catch(error => {
            console.log(error);
        });
    }
    async userInfo(token) {
        return await this.httpService.get('https://eu.battle.net/oauth/userinfo', {
            headers: {
                'Authorization': 'Bearer ' + token
            },
        })
            .toPromise()
            .then(response => {
            return response.data;
        });
    }
};
BattlenetService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [common_1.HttpService])
], BattlenetService);
exports.BattlenetService = BattlenetService;
//# sourceMappingURL=battlenet.service.js.map